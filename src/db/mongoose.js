const { ObjectID } = require('bson');
const mongoose = require('mongoose');

// Mongoose talks to Mongo DB in the background, so this is very similar 
// to what we have in the mongodbX.js files:
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

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