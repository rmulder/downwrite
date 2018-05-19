// @flow

import React, { Component } from 'react'
import styled from 'styled-components'
import { EditorState, convertToRaw, type ContentState } from 'draft-js'
import Helmet from 'react-helmet'
import { matchPath, type Location, type Match } from 'react-router-dom'
import {
  Autosaving,
  Input,
  NightMode,
  Loading,
  Wrapper,
  Helpers,
  Privacy,
  WordCounter,
  TimeMarker
} from './components'
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'
import Loadable from 'react-loadable'
import { superConverter, createHeader } from './utils/responseHandler'
import { POST_ENDPOINT } from './utils/urls'

const LazyEditor = Loadable({
  loader: () => import('./components/Draft'),
  loading: Loading
})

const LazyExportMarkdown = Loadable({
  loader: () => import('./components/Export'),
  loading: Loading
})

type EditorSt = {
  title: string,
  post: Object,
  loaded: boolean,
  updated: boolean,
  editorState: EditorState,
  dateModified: Date,
  publicStatus: boolean,
  autosaving: boolean
}

type Query = {
  params: {
    id: string
  }
}

type EditorPr = {
  token: string,
  user: string,
  location: Location,
  match: Match | Query,
  title?: string,
  post?: Object,
  editorState?: EditorState
}

const OuterEditor = styled.div`
  padding: 0 8px;
`

// TODO: Document this
// - Initial render
// - Rerouting
// - EditorState changes
// - Updating the post on the server

export default class Edit extends Component<EditorPr, EditorSt> {
  static displayName = 'Edit'

  static async getInitialData({ query }: { query: Query }, token: string) {
    const config = createHeader('GET', token)
    const { id } = query.params

    const post = await fetch(`${POST_ENDPOINT}/${id}`, config).then(res => res.json())

    return {
      post,
      editorState: EditorState.createWithContent(superConverter(post.content)),
      title: post.title
    }
  }

  state = {
    autosaving: false,
    editorState: this.props.editorState ? this.props.editorState : EditorState.createEmpty(),
    post: this.props.post || {},
    title: this.props.title || '',
    updated: false,
    loaded: !isEmpty(this.props.post),
    unchanged: false,
    document: null,
    publicStatus: false,
    dateModified: new Date()
  }

  // NOTE: Maybe this should only handle the fetch and not update the UI
  autoSave = debounce(() => {
    this.setState({ autosaving: true }, this.updatePostContent)
  }, 5000)

  onChange = (editorState: EditorState) => {
    this.autoSave()
    this.setState({ editorState })
  }

  fetchPost = async (id: string) => {
    const { token } = this.props
    const config = createHeader('GET', token)

    const req = await fetch(`${POST_ENDPOINT}/${id}`, config)
    const post: Object = await req.json()

    return post
  }

  updatePost = (body: Object) => {
    const { match, token } = this.props
    const config = createHeader('PUT', token)

    const payload = { ...config, body: JSON.stringify(body) }

    return fetch(`${POST_ENDPOINT}/${match.params.id}`, payload)
  }

  updatePostContent = () => {
    let { post, title, dateModified, editorState, publicStatus } = this.state
    const { user } = this.props
    const cx: ContentState = editorState.getCurrentContent()
    const content = convertToRaw(cx)
    const { _id, __v, ...postBody } = post

    const newPost = {
      ...postBody,
      title,
      public: publicStatus,
      content,
      dateModified,
      user
    }

    const updater = () => this.setState({ autosaving: false })

    return this.updatePost(newPost).then(() => setTimeout(updater, 3500))
  }

  updateTitle = ({ target }: SyntheticInputEvent<*>) => this.setState({ title: target.value })

  updatePrivacy = () => this.setState(({ publicStatus }) => ({ publicStatus: !publicStatus }))

  async componentDidMount() {
    const { match } = this.props
    const post = await this.fetchPost(match.params.id)
    const content = await superConverter(post.content)

    this.setState({
      post: {
        ...post,
        content
      },
      publicStatus: post.public,
      editorState: EditorState.createWithContent(content),
      title: post.title,
      loaded: true
    })
  }

  async componentDidUpdate(prevProps: EditorPr) {
    const { location } = this.props
    if (prevProps.location !== location) {
      this.autoSave.flush()

      const match: Match = matchPath(location.pathname, { path: '/:id/edit' })

      const currentPost = await this.getPost(match.params.id)
      const currentContent = await superConverter(currentPost.content)

      if (!isEmpty(currentPost)) {
        this.setState({
          post: {
            ...currentPost,
            content: currentContent
          },
          editorState: EditorState.createWithContent(superConverter(currentPost.content)),
          title: currentPost.title,
          loaded: true
        })
      }
    }
  }

  // NOTE:
  // Removes the no-op error when transitioning Location
  // Will need to account for any type of transitioning or auto updating other posts
  componentWillUnmount() {
    this.autoSave.flush()
  }

  // NOTE: Could be redundant
  shouldComponentUpdate(nextProps: Object, nextState: { post: Object }) {
    return isEmpty(nextState.post) || isEmpty(nextState.post.content.blocks)
  }

  render() {
    const { title, post, loaded, editorState, publicStatus, autosaving } = this.state
    const { match } = this.props

    return !loaded ? (
      <Loading />
    ) : (
      <NightMode>
        <Helmet title={title} titleTemplate="%s | Downwrite" />
        {autosaving && <Autosaving />}
        <Wrapper sm={true}>
          <Helpers onChange={this.updatePostContent} buttonText="Save">
            <LazyExportMarkdown
              editorState={editorState}
              title={title}
              date={post.dateAdded}
            />
            <Privacy
              id={match.params.id}
              title={title}
              publicStatus={publicStatus}
              onChange={this.updatePrivacy}
            />
            <WordCounter editorState={editorState} />
          </Helpers>
          <OuterEditor sm>
            <TimeMarker dateAdded={post.dateAdded} />
            <Input value={title} onChange={this.updateTitle} />
            <div>
              {editorState !== null && (
                <LazyEditor editorState={editorState} onChange={this.onChange} />
              )}
            </div>
          </OuterEditor>
        </Wrapper>
      </NightMode>
    )
  }
}
