const request = require('supertest')
// supertest is a module that tests Express routes. supertest does not need the server 
// to be up and running.
// jwt and mongoose requirements moved to db.js in fixtures directory.
const app = require('../src/app') // Loading in the Express server definition.
const User = require('../src/models/user')
// userOneId and userOne definition moved to db.js in fixtures directory (test database).
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)
    // beforeEach is a Jest function, available as a global. It runs once before each of the test cases 
    // that follow. 
    // console.log('beforeEach')
    // contents of this call moved to setupDatabase function in db.js in fixtures directory.
    

// afterEach(() => {
//     // see beforeEach.
//     console.log('afterEach')
// })
test('Should sign up a new user', async () => {
    // response: store request body in variable so that it can be used for 
    // further assertions.
    const response = await request(app).post('/users').send(
        {
            name: 'Hübi',
            email: 'hübi@example.com',
            password: 'hbqwApp749!'
        }
    ).expect(201)
    // Make sure that the new user has been saved to the database:
    const user = await User.findById(response.body.user._id)
    // Make sure the new user exists:
    expect(user).not.toBeNull()
    // Assertions about the response:
    expect(response.body).toMatchObject({
        user: {
            name: 'Hübi',
            email: 'hübi@example.com'
        },
        token: user.tokens[0].token
    })
    // Make sure that the user password is not stored in plain text:
    expect(user.password).not.toBe('hbqwApp749!')
})
test('Should log in existing user', async () => {
    const response = await request(app).post('/users/login').send(
        {
            email: userOne.email,
            password: userOne.password
        }
    ).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
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
    // Search for the user in the database:
    const user = await User.findById(userOneId)
    // userOneId: That's the user who logged in in the previous test. The other one won't work.
    // Make sure the user got deleted (search result is null):
    expect(user).toBeNull()

})
test('Should not delete unauthenticated user', async() => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401) // 401 is the return code reserved for cases in which the authentication validation fails.
})
test('Should upload avatar image', async() => {
    // Tests the file (avatar) upload function
    await request(app)
    // post, set, attach: Supertest functions
    .post('/users/me/avatar')
    // Authorization, Bearer: Set up like this in Postman
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    // avatar: Set up like this in Postman; 2nd arg: path to file from root of project, here: tests
    
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)
    const user = await User.findById(userOneId)
    // This here fails:
    // expect({}).toBe({})
    // because the toBe function uses the === operator, which only resolves to true if one is referring 
    // to exactly the same object. This is not the case here; there are 2 different empty objects.
    // Therefore, we use the equalTo function.
    expect({}).toEqual({})
    // Now we'd like to check if the uploaded image is binary data. Comparing the image in the database with 
    // the image used by the test is complicated because we cannot directly compare these: The image in the database will 
    // be different because we used the sharp module to manipulate it.
    // Checking whether both files are indeed binary data seems sufficient, however.
    expect(user.avatar).toEqual(expect.any(Buffer))
})
test('Should update valid user fields', async() => {
    await request(app)
    .patch('/users/me')
    // We need to set the Authorization HTTP header before sending the request.
    // The function needs to check whether the token exists and is valid.
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name: 'Jim'})
    .expect(200)
    // Checking the data:
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Jim')
})
test('Should not update invalid user fields', async() => {
    
    await request(app)
    .patch('/users/me')
    // We need to set the Authorization HTTP header before sending the request.
    // The function needs to check whether the token exists and is valid.
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ location: 'Philadelphia' })
    .expect(400)
})
