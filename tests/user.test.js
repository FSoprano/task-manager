const request = require('supertest')
// supertest is a module that tests Express routes. supertest does not need the server 
// to be up and running.
const app = require('../src/app') // Loading in the Express server definition.
const User = require('../src/models/user')
const userOne = {
    name: 'Mike',
    email: 'mike@example.com',
    password: 'kbqwApp749?'
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
