const mongoose = require('mongoose')


// Refactored from mongoose.js:
const Task = mongoose.model('Task', {
    // The model defines the database structure:
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    }
})
module.exports = Task