const app = require('./routes') 
const supertest = require('supertest')
const request = supertest(app)

it('gets the root status', async done => {
  const response = await request.get('/')

  expect(response.status).toBe(200)
  done()
})