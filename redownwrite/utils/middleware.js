const jwt = require('jsonwebtoken')
const fs = require('fs')
let key = fs.readFileSync('../private.key')

const verifyJWT = token => new Promise(resolve => resolve(jwt.verify(token, key)))

const isNotLoggedIn = async (req, res, next) => {
  const token = req.universalCookies.get('DW_TOKEN')

  if (token) {
    const { user } = await verifyJWT(token)

    return user && next()
  }

  return res.redirect('/login')
}

module.exports = { verifyJWT, isNotLoggedIn }
