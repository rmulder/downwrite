const express = require('express')
const next = require('next')
const jwt = require('jsonwebtoken')
const cookiesMiddleware = require('universal-cookie-express')
require('isomorphic-fetch')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const handle = app.getRequestHandler()

const verifyJWT = token =>
	new Promise(resolve => resolve(jwt.verify(token, 'secret account key')))

const isLoggedIn = async (req, res, next) => {
	try {
		await verifyJWT(req.cookies['id_token'])
		return res.redirect('/')
	} catch (err) {
		next()
		return
	}
}

const isNotLoggedIn = async (req, res, next) => {
	try {
		await verifyJWT(req.universalCookies.get('id_token'))
		next()
		return
	} catch (err) {
		return res.redirect('/login')
	}
}

const getPosts = async token => {
	const config = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		},
		mode: 'cors',
		cache: 'default'
	}

	const res = await fetch('http://localhost:4411/posts', config)
	const posts = await res.json()

	return posts
}

const getPreview = async id => {
	const res = await fetch(`http://localhost:4411/posts/preview/${id}`, { mode: 'cors' })
	const post = await res.json()

	return post
}

app
	.prepare()
	.then(() => {
		const server = express()

		server.use(cookiesMiddleware())
		server.get('/', isLoggedIn, (req, res) => app.render(req, res, '/'))
		server.get('/new', isLoggedIn, (req, res) => app.render(req, res, '/new'))
		server.get('/login', isLoggedIn, (req, res) => app.render(req, res, '/login'))
		server.get('/:id/edit', isLoggedIn, (req, res) => app.render(req, res, '/edit', req.query))
		server.get('/:id/preview', (req, res) => app.render(req, res, '/preview'))
		server.get('/other', isNotLoggedIn, (req, res) => app.render(req, res, '/other'))
		server.get('*', (req, res) => handle(req, res))

		server.listen(4000, err => {
			if (err) throw err
			console.log('> Ready on http://localhost:4000')
		})
	})
	.catch(error => {
		console.error(error)
		process.exit(1)
	})