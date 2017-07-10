import React from 'react'
import { css } from 'glamor'
import { Editor, Raw } from 'slate'
import Button from './components/Button'
import Input from './components/Input'
import Loading from './components/Loading'
import Wrapper from './components/Wrapper'

const editorShell = css({
  flex: 1,
  marginTop: '-1px',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 16,
  minHeight: '100%',
  width: `100%`,
  position: 'absolute',
  left: 0,
  right: 0
})

const editorInner = css({
  backgroundColor: 'white',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'rgba(0, 0, 0, .125)',
  fontWeight: '400'
})

class Edit extends React.Component {
  state = {
    post: {},
    loaded: false
  }

  prepareContent = content => Raw.deserialize(content, { terse: true })

  componentWillMount () {
    fetch(`/posts/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(data => this.setState({
        post: {
          ...data,
          content: JSON.parse(data.content)
        }
      }))
      .then(() => this.setState({
        post: {
          ...this.state.post,
          content: this.prepareContent(this.state.post.content)
        },
        loaded: true
      }))
  }

  // onChange = () => console.log('...okay')

  updateTitle = e => this.setState({
    post: {
      ...this.state.post,
      title: e.target.value
    }
  })

  updatePost = () => console.log(...this.state)

  onDocumentChange = (document, state) => this.setState({
    post: {
      ...this.state.post,
      content: state,
      document
    }
  })


  render () {
    const { post, loaded } = this.state

    return (
      !loaded
      ? <Loading />
      : (
        <Wrapper paddingTop={16}>
          <span>{post.id}</span>
          <Input value={post.title} onChange={this.updateTitle} />
          <Wrapper className={css(editorShell, editorInner)}>
            <Button positioned onClick={this.updatePost}>Up</Button>
            <Editor
              state={post.content}
              onKeyDown={this.onKeyDown}
              onDocumentChange={this.onDocumentChange}
            />
          </Wrapper>
        </Wrapper>
      )
    )
  }
}

export default Edit