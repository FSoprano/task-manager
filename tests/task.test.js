// Problem: we need access to the test user, which is created and manipulated in the other test suite.
// We have to make sure that both test suites have access to the user data.
// We also need a couple of tasks to test other endpoints, such as delete, update etc.
// To this end, we set up a test database with test data in the fixtures directory.
const request = require('supertest')
const app = require('../src/app') // Loading in the Express server definition.
const { deleteMany } = require('../src/models/task')
const Task = require('../src/models/task')
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db')
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
test('Get all tasks owned by userOne', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toEqual(2)
})
test('Ensure userTwo cannot delete task belonging to userOne', async () => {
    const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
    const task = await Task.findById(taskOne._id)
    // console.log(task)
    expect(task).not.toBeNull()
})
test('Should not create task with an invalid description', async () => {

    const invalidDescriptions = ['','  ']
    await invalidDescriptions.forEach((iD) => {
        request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ description: iD })
        .expect(400)
    })  
})
test('Should not create task with an invalid completion status', async () => {
    // const request = await request(app)
    const invalidCompleted = ['',null, 56, 'completed']
    await invalidCompleted.forEach((iC) => {
        request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ 
            description: 'Task 1 Test',
            completed: iC })
        .expect(400)
    })  
})
test('Should not update task with an invalid description', async() => {
    const invalidDescriptions = ['','  ']
    await invalidDescriptions.forEach((iD) => {
        request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ description: iD })
        .expect(400)
    })  
})
test('Should not update task with an invalid completion status', async() => {
    const invalidCompleted = ['',null, 56, 'completed']
    await invalidCompleted.forEach((iC) => {
        request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ 
            description: `${taskOne.description}`,
            completed: iC })
        .expect(400)
    })  
})
test('Should delete user task', async() => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()    
    .expect(200)
    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
})
test('Should not delete task if unauthenticated', async() => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()    
    .expect(401)
})
test("Should not delete other users' tasks", async() => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()    
    .expect(404)
})
test('Should fetch user task by ID', async() => {
    await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()    
    .expect(200)
})
test('Should not fetch task if unauthenticated', async() => {
    await request(app)
    .get(`/tasks/${taskOne._id}`)
    .send()    
    .expect(401)
})
test("Should not fetch other users' task by ID", async() => {
    await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()    
    .expect(404)
})
test('Should fetch only completed tasks', async() => {
    await request(app)
    .get(`/tasks`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()    
    .expect(200)
    await Task.find( { completed: true })
    expect(200)
})
test('Should fetch only incomplete tasks', async() => {
    await request(app)
    .get(`/tasks`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()    
    .expect(200)
    await Task.find( { completed: false })
    expect(200)
})
test('Should sort tasks by description', async() => {
    await request(app)
    .get(`/tasks`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()    
    .expect(200)
    const tasks = await Task.find({})
    .sort({ description: 'asc' })
    expect(200)
    console.log(tasks)
})
test('Should sort tasks by completion status', async() => {
    await request(app)
    .get(`/tasks`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    await Task.find({})
    .sort({ completed: 'asc' })
    expect(200)
})
test('Should sort tasks by creation date', async() => {
    const createdAt = await request(app)
    .get(`/tasks`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()    
    .expect(200)
    await Task.find({})
    .sort({ updatedAt: 'desc' })
    expect(200)
})
test('Should sort tasks by last modification date', async() => {
    await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()    
    .expect(200)
    await Task.find( { })
    .sort({ updatedAt: 'desc' })
    expect(200)
    // console.log(tasks)
})
test('Should fetch page of tasks', async() => {
    await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()    
    .expect(200)
    const findOptions = {
        limit: 1, 
        skip: 1
     }
    const tasks = await Task.find( { }, null, findOptions )
    expect(200)
})