import React, { Component } from 'react'
import styled, { injectGlobal } from 'styled-components'
import Nav from './nav'
import Toggle from './toggle'
import Header from './header'
import { withErrors, ErrorContainer, UIErrorBanner } from './ui-error'
import Null from './null'
import { colors, fonts } from '../utils/defaultStyles'
import '../utils/typescale.css.js'

injectGlobal`
  *,
  *::before,
  *::after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  html {
    height: 100%;
    tab-size: 2;
    box-sizing: border-box;
    text-size-adjust: 100%;
    background-color: #f9fbfc;
    font: 400 100%/1.6 ${fonts.monospace};
    color: ${colors.text};
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
  }

  a {
    background-color: transparent;
    text-decoration: none;
    color: ${colors.blue400};
  }

  a:active,
  a:hover {
    color: ${colors.blue100};
    outline: 0;
  }

  body,
  #__next {
    width: 100%;
    height: 100%;
  }


  #__next::before {
  content: '';
  display: block;
  height: 4px;
  width: 100%;
  background-image: linear-gradient(to right, #2584a5, #4fa5c2);
}
`

const ClearFixed = styled.div`
  height: 100%;
  &::after {
    content: '';
    display: table;
    clear: both;
  }
`

ClearFixed.displayName = 'ClearFixed'

const Container = styled.div`
  min-height: 100%;
`

Container.displayName = 'Container'

const AppContainer = styled.div`
  min-height: 100%;
  display: block;
  font-family: ${fonts.monospace};
`

AppContainer.displayName = 'AppContainer'

class UIShell extends Component {
  static displayName = 'UIShell'

  render() {
    const { children, authed, token, user, name, route } = this.props
    return (
      <ErrorContainer>
        <Toggle>
          {(navOpen, toggleNav, closeNav) => (
            <AppContainer>
              <UIErrorBanner />
              <ClearFixed>
                <Container>
                  <Header
                    route={route}
                    authed={authed}
                    open={navOpen}
                    onClick={toggleNav}
                  />
                  {children}
                </Container>
                {navOpen && (
                  <Nav
                    pathname={route}
                    closeNav={closeNav}
                    token={token}
                    user={user}
                    username={name}
                  />
                )}
              </ClearFixed>
            </AppContainer>
          )}
        </Toggle>
      </ErrorContainer>
    )
  }
}

export default withErrors(UIShell)