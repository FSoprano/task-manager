// Problem: we need access to the test user, which is created and manipulated in the other test suite.
// We have to make sure that both test suites have access to the user data.
// We also need a couple of tasks to test other endpoints, such as delete, update etc.
// To this end, we set up a test database with test data in the fixtures directory.
const request = require('supertest')
const app = require('../src/app') // Loading in the Express server definition.
const Task = require('../src/models/task')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')
beforeEach(setupDatabase)
test('Should create task for user', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send(
        {
            description: 'From my test'
        }
    ).expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})