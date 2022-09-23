// For an explanation, see task.test.js
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
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
const userTwoId = new mongoose.Types.ObjectId() 
// we define this ID outside of the userOne function because we need it in two places.
// we need the ID to generate an auth token, which we need in turn to test endpoints that require
// authentication.
const userTwo = {
    _id: userTwoId,
    name: 'Brian',
    email: 'brian@example.com',
    password: 'myhouse099@@',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.SECRET_KEY)
    }]
}
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completed: false,
    owner: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task ',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task ',
    completed: true,
    owner: userTwo._id
}


const setupDatabase = async() => {
    await User.deleteMany() // Without search criteria, this function deletes all users from the database, so we can 
    // start tests with a clean slate.
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}