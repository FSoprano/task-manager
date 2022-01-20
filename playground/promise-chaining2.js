require('../src/db/mongoose')
const Task = require('../src/models/task')


// findByIdAndDelete is a mongoose method.
// Prosmise chaining challenge:
// 1. Delete a specific task:
Task.findByIdAndDelete('61e04cdf004b1e3b72e65841').then(
    (task) => {
        console.log(task)
        // 2. Return all uncompleted tasks:
        return Task.countDocuments({ completed: false})
    }).then(result => {
        console.log(result)
    }).catch(e => {
        console.log(e)
    })