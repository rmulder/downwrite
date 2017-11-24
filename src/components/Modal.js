// @flow
import * as React from 'react'
import { Flex, Row } from 'glamor/jsxstyle'
import { css, keyframes } from 'glamor'
import { Wrapper, CloseIcon } from './'

const modalCloseButton: string = css({
	position: 'absolute',
	right: 16,
	top: 16,
	border: 0,
	background: 'none',
	appearance: 'none',
	display: 'block',
	margin: 0
})

const fadein: string = keyframes({
	'0%': { transform: 'translate(0, 75%)', opacity: 0 },
	'100%': { transform: 'translate(0, 0)', opacity: 1 }
})

const Overlay = (props: {}) => (
	<Flex
		zIndex={999}
		justifyContent="center"
		alignItems="center"
		flexDirection="Column"
		backgroundColor="rgba(21, 69, 93, 0.925)"
		width="100%"
		backgroundBlendMode="multiply"
		{...props}
	/>
)

// TODO: Remove scrolling on open

export default class extends React.Component<{
	closeUIModal: Function,
	children: React.Node
}> {
	componentWillMount() {
		if (document.body) {
			document.body.classList.add('__modalOpen')
		}
	}

	componentWillUnmount() {
		if (document.body) {
			document.body.classList.remove('__modalOpen')
		}
	}

	render() {
		return (
			<Overlay position="fixed" top={0} bottom={0}>
				<Wrapper
					animation={`${fadein} .45s`}
					background="white"
					width="100%"
					height="50%"
					position="relative"
					display="flex">
					<button onClick={this.props.closeUIModal} className={css(modalCloseButton)}>
						<CloseIcon />
					</button>

					<Flex flexDirection="column" justifyContent="center" flex={1}>
						<Row alignItems="center" padding={8}>
							{this.props.children}
						</Row>
					</Flex>
				</Wrapper>
			</Overlay>
		)
	}
}