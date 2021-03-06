const mongoose = require('mongoose')


// Refactored from mongoose.js:
const taskSchema = new mongoose.Schema( {
    // The model defines the database structure:
    // We need a schema to define additional options (here: the timestaps.).
    // Before, we just had a Task model.
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: { // Bind task to the ID of a particular user. Mind that the owner ID
        // (object ID) created here is the same as the login user._id.
        // Don't confuse with the task ID.
        type: mongoose.Schema.Types.ObjectId,  // a mongoose type for object IDs
        required: true,
        ref: 'User'   // ref is for 'reference'. This gives us access to 
        // the entire user profile from a task (profile of the user who created 
        // the task.)
    } // Hint: Trash existing database / recreate after changing a model.
}, {
    timestamps: true
})
const Task = mongoose.model('Task', taskSchema)
module.exports = Task