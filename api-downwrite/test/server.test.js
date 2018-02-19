const server = require('../src/server')

const mock = jest.fn()
const req = {}

const defaultGet = {
  method: 'GET',
  url: '/posts',
  payload: {}
}

const previewReq = {
  method: 'GET',
  url: '/posts/preview/aa3dd293-2a0e-478c-81e7-a0b9733e8b'
}

describe('Server Endpoints Perform', () => {
  it('GET | status code is 400', async () => {
    const request = Object.assign({}, defaultGet)
    const response = await server.inject(request)

    expect(response.statusCode).isEqual(400)
  })

  it('GET | PREVIEW | status code is 200 on a public post', async () => {
    const request = Object.assign({}, previewReq)
    const response = await server.inject(request)

    expect(response.statusCode).isEqual(200)
  })

  xit('POST')

  xit('USER')
})
