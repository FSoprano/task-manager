const mongoose = require('mongoose')
const validator = require('validator')

// Refactored from mongoose.js:
const User = mongoose.model('User', {
    // The model defines the database structure:
    name: {
        type: String,
        required: true, // required is available for all types.
        trim: true  // From mongoose. Ensures superfluous at the beginning or the end 
        // spaces are removed and that no one can enter a name consisting of spaces only.
    },
    age: {
        type: Number,
        trim: true, 
        default: 0,
        
        // Make sure that age is a positive number if specified:
        validate(value) {
            if ( value < 0 ) {
                throw new Error('Age must be a positive number!')
            }
        }
        // validate is provided by mongoose. Mongoose does not offer that 
        // many validators. In comes validator.js !
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true, // From mongoose. Converts the entered address to lowercase.
        validate(value) {
            if (!validator.isEmail(value)) {
                // function in if-statement is from the validator library.
                throw new Error('Email is invalid.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7, // A built-in Mongoose PW validator that checks the min. length.
        validate(pw) {
            if (pw.toLowerCase().includes('password')) {
                // We use toLowerCase() to cover the cases where 'password'
                // contains capital letters.
                throw new Error ("Password must not contain 'password'.")
            } // else if (pw.length < 7) {
            //     throw new Error ('Password too short!')
            // } // This code here does the same as minLength. It seems
            // that you can have only one validate call per field.
        }

    }
})
module.exports = User