require('../src/db/mongoose')
const { findByIdAndUpdate, countDocuments } = require('../src/models/user')
const User = require('../src/models/user')
const user = require('../src/models/user')

// findByIdAndUpdate is a mongoose method.
// Example of prosmise chaining:
// 1. Update a user's age with a known ID to 1.
// User.findByIdAndUpdate('61e198190fbbe9d5a907e69f', { age: 1}).then(
//     (user) => {
//         console.log(user)
//         // 2. Get all users with an age of 1:
//         return User.countDocuments({ age: 1})
//     }).then(result => {
//         console.log(result)
//     }).catch(e => {
//         console.log(e)
//     })

// The same using async/await:
const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate( id, { age } )  // Short for { age: age }
    const count = await User.countDocuments( { age })
    return count
}
updateAgeAndCount('61e198190fbbe9d5a907e69f', 2).then(count => {
    console.log(count)
}).catch(e => {
    console.log(e)
})