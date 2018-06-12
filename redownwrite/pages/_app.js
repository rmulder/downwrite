import App, { Container } from 'next/app'
import React from 'react'
import isEmpty from 'lodash/isEmpty'
import { getToken } from '../utils/responseHandler'
import UIShell from '../components/ui-shell'
import AuthProvider, { withAuth } from '../components/auth'
import { withErrors } from '../components/ui-error'

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    let { token } = getToken(ctx.req, ctx.query)

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, router, token }
  }

  render() {
    const { Component, pageProps, token, router } = this.props
    const authed = !isEmpty(token)
    const Cx = withAuth(withErrors(Component))
    return (
      <Container>
        <AuthProvider token={token} authed={authed}>
          <UIShell route={router.route}>
            <Cx {...pageProps} route={router.route} />
          </UIShell>
        </AuthProvider>
      </Container>
    )
  }
}