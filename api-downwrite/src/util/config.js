const fs = require('fs')
let key = fs.readFileSync('private.key')

const address =
  process.env.NODE_ENV === 'production'
    ? `${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_ADDRESS}`
    : `127.0.0.1:27017/downwrite`

module.exports = {
  key,
  dbCreds: `mongodb://${address}`
}
