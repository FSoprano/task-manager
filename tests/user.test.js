const request = require('supertest')
// supertest is a module that tests Express routes. supertest does not need the server 
// to be up and running.
const app = require('../src/app') // Loading in the Express server definition.

test('Should sign up a new user', async () => {
    await request(app).post('/users').send(
        {
            name: 'Hübi',
            email: 'hübi@example.com',
            password: 'hbwApp749!'
        }
    ).expect(201)
})