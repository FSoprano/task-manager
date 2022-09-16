// For an explanation, see task.test.js
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
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
const User = require('../../src/models/user')

const setupDatabase = async() => {
    await User.deleteMany() // Without search criteria, this function deletes all users from the database, so we can 
    // start tests with a clean slate.
    await new User(userOne).save()
}

module.exports = {
    userOneId,
    userOne,
    setupDatabase
}