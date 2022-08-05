const { ObjectID } = require('bson');
const mongoose = require('mongoose');

// Mongoose talks to Mongo DB in the background, so this is very similar 
// to what we have in the mongodbX.js files:
mongoose.connect(process.env.DATABASE_URL);

// This here fixes the following Jest test error:
// "A worker process has failed to exit gracefully and has been force exited. 
// This is likely caused by tests leaking due to improper teardown. 
// Try running with --detectOpenHandles to find leaks. Active timers can also cause this, 
// ensure that .unref() was called on them.""
afterAll(() => {
    mongoose.connection.close();
})

// const me = new User(
//     { 
//       name: '   Chucky   ', 
//       email: '   chucky@example.com  ',
//       password: 'GoHomeYouIdiot123'
//     }
// )

// save() has no arguments. save() returns a promise.
// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!', error)
// })

// Task factored out into src/task.js

// const garage = new Task(
//     { 
//       description: 'Do that now.',
//       completed: true
//      },
// );

// // save() has no arguments. save() returns a promise.
// garage.save().then(() => {
//     console.log(garage)
// }).catch((error) => {
//     console.log('Something went wrong!', error)
// })