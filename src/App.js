// @flow
import * as React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Block } from 'glamor/jsxstyle'
import NewPost from './NewPost'
import EditPost from './EditPost'
import { Header } from './components'
import Main from './Main'
import NoMatch from './NoMatch'
import Home from './Home'
import SignOut from './SignOut'
import { PrivateRoute } from './CustomRoutes'
import { withCookies, Cookies } from 'react-cookie'

class App extends React.Component<{ cookies: typeof Cookies }, { authed: boolean }> {
	state = {
		authed: false
	}

	componentWillMount() {
		const token: string = this.props.cookies.get('token')
		this.setState({
			authed: token !== undefined && token !== 'undefined'
		})
	}

	setAuth = (authed: boolean) => {
		return this.setState({ authed })
	}

	signOut = () => {
		const rmToken: Function = () => {
			this.props.cookies.remove('token')
			this.props.cookies.remove('id')
		}

		return this.setState({ authed: false }, rmToken)
	}

	render() {
		const { authed } = this.state
		return (
			<Router>
				<Block fontFamily="var(--primary-font)" height="calc(100% - 82px)">
					{authed && <Header signOut={this.signOut} name="Downwrite" />}
					<Switch>
						<Route
							exact
							path="/"
							render={(props: Object) =>
								authed === true ? (
									<Main {...props} />
								) : (
									<Home {...props} setAuth={this.setAuth} />
								)}
						/>
						<PrivateRoute authed={authed} path="/new" component={NewPost} />
						<PrivateRoute authed={authed} path="/:id/edit" component={EditPost} />
						<Route
							path="/signout"
							render={(props: Object) => <SignOut signOut={this.signOut} />}
						/>
						<Route component={NoMatch} />
					</Switch>
				</Block>
			</Router>
		)
	}
}

export default withCookies(App)
