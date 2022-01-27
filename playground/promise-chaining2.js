require('../src/db/mongoose')
const Task = require('../src/models/task')


// findByIdAndDelete is a mongoose method.
// Prosmise chaining challenge:
// 1. Delete a specific task:
// Task.findByIdAndDelete('61e04cdf004b1e3b72e65841').then(
//     (task) => {
//         console.log(task)
//         // 2. Return all uncompleted tasks:
//         return Task.countDocuments({ completed: false})
//     }).then(result => {
//         console.log(result)
//     }).catch(e => {
//         console.log(e)
//     })

// The same using async/await:
const deleteAndCountIncomplete = async ( id ) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments( {completed: false} )
    return count
}
deleteAndCountIncomplete('61e04fa21ce16a84562dca8d').then(count => {
    console.log(count)
}).catch(e => {
    console.log(e)
})