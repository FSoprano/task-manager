const request = require('supertest')
// supertest is a module that tests Express routes. supertest does not need the server 
// to be up and running.
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app') // Loading in the Express server definition.
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId() 
// we define this ID outside of the userOne function because we need it in two places.
// we need the ID to generate an auth token, which we need in turn to test endpoints that require
// authentication.
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'kbqwApp749?',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.SECRET_KEY)
    }]
}

beforeEach( async () => {
    // beforeEach is a Jest function, available as a global. It runs once before each of the test cases 
    // that follow. Here we have only one test case, so beforeEach() runs a single time.
    console.log('beforeEach')
    await User.deleteMany() // Without search criteria, this function deletes all users from the database, so we can 
    // start tests with a clean slate.
    await new User(userOne).save()
})
// afterEach(() => {
//     // see beforeEach.
//     console.log('afterEach')
// })
test('Should sign up a new user', async () => {
    await request(app).post('/users').send(
        {
            name: 'Hübi',
            email: 'hübi@example.com',
            password: 'hbqwApp749!'
        }
    ).expect(201)
})
test('Should log in existing user', async () => {
    await request(app).post('/users/login').send(
        {
            email: userOne.email,
            password: userOne.password
        }
    ).expect(200)
})
test('Should not log in non-existing user', async () => {
    await request(app).post('/users/login').send(
        {
            email: 'grotty@example.com',
            password: 'grotty0IsHere!'
        }
    ).expect(400)
})
test('Should get profile for user', async () => {
    await request(app)
    .get('/users/me')
    // We need to set the Authorization HTTP header before sending the request.
    // The function needs to check whether the token exists and is valid.
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})
test('Should not get profile for unauthenticated user', async() => {
    await request(app)
    .get('/users/me')
    // We don't send an authorization header (authentication token) at all in this test.
    .send()
    .expect(401) // 401 is the return code reserved for cases in which the authentication validation fails.
})
test('Should delete authenticated user', async() => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()    
    .expect(200)
})
test('Should not delete unauthenticated user', async() => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401) // 401 is the return code reserved for cases in which the authentication validation fails.
})
