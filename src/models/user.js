const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema(
    {
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
            unique: true, // Different users should never use the same email.
            // Hint: Need to drop the entire database to make this work.
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
    
        }, 
    // If a user cannot log, the token remains valid, and if it falls 
    // into the wrong hand, be used by somebody else. It is therefore necessary, 
    // that we track all tokens; Each token will be an object with a key of 
    // 'token', Multiple tokens 
    // will be objects in an array of tokens. Tracking tokens gives us 
    // the chance to invalidate them.
    tokens: [{
        token: { type: String,
               required: true
            }
        }]
    } , { // This 2nd object we pass in creates two timestamps in the database:
        // createdAt and updatedAt
        timestamps: true
    }
)
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // The user's ID is associated with the owner Object ID in the Task model.
    foreignField: 'owner' // ref set up in the owner field of the Task model
}) // This is a virtual reference (sth. that is not stored in the database. 
// It sets up a relationship with the Task model from the User model. 
// Cf. the reference we set in the owner field of the Task model, which references 
// the User model, and does get stored in the database.

/* //Function to hide certain properties (pw, tokens array) from the 
// response object:
userSchema.methods.getPublicProfile = function () {
    const user = this
    const userObject = user.toObject()  // toObject() is a mongoose function.
    // Removing certain props from the response object:
    delete userObject.password
    delete userObject.tokens
    return userObject
} */
// Function to hide certain properties (pw, tokens array) from the 
// response object (elegant solution wihtout callback function)
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()  // toObject() is a mongoose function.
    // Removing certain props from the response object:
    delete userObject.password
    delete userObject.tokens
    return userObject
}
// Function to generate a requested authentication token:
// Hint: .statics methods or functions are accessible on the model.
// .methods methods or functions are accessible on the instances of a model.
userSchema.methods.generateAuthToken = async function () {
    const user = this
    // Remember: this -> 'async function', not arrow function.
    const token = jwt.sign({ _id: user._id.toString()}, 'thisismynewcourse')
    user.tokens = user.tokens.concat( {token} ) // Shorthand for {token: token} 
    // Adding each token as an object with key token to the array of tokens.
    await user.save() // Saving the tokens to the database.
    return token
    
}
// User sign-up. We have to create a new schema to do this.
userSchema.statics.findByCredentials = async (email, password) => {
    // Need to find user by email first. We cannot find by credentials because
    // we have the password in plain text, and the hashed pw is only in the 
    // database.

    const user = await User.findOne( {email} )
    // Remember {email} -> shorthand for {email: email}
    // findOne is similar to findById except that it takes in an object. 
    if (!user) {
        throw new Error ('Unable to log in.')
    } // Function stops running if user is not found by email.

    const isMatch = await bcrypt.compare(password, user.password)
    // password = pw provided in plain text; user.password =  hashed pw.
    // If the passwords don't match
    if (!isMatch) {
        throw new Error ('Unable to log in.')
    } // Function stops running if passwords don't match.

    // If email and pw are OK:
    return user
}

// Hash the plain text password before saving:
userSchema.pre('save', async function (next) {
    // It must be function () here because arrow functions do not bind this.
    const user = this // Just a convencience that makes it unnecessary to 
    // specify 'this' througout the functon.
    // This function does something before a user is saved. 'this' gives 
    // us access to the individual user.

    console.log('just before saving the user')
    if (user.isModified('password')) {
        // This checks if the password has been changed by 
        // either creating or updating a user.
        user.password = await bcrypt.hash(user.password, 8)
        // 8 is the number of hashing rounds.
    }

    next() // This tells the app that we're finished running code 
    // before a user is saved. We can't just use the 
    // end of the function call for this because it won't insure that asynchronous 
    // processes have been finished. We have to make sure that next() gets called.
    // Otherwise the function is going to hang infinitely. 
})

userSchema.pre('remove', async function (next) {
    // Delete user tasks when user is removed:
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})
// Refactored from mongoose.js:
const User = mongoose.model('User', userSchema)
// The object that is passed in as the 2nd argument is converted by mongoose  
// into a SCHEMA. In order to take advantage of the middleware functions provided 
// by mongoose (validate, save for password authentication), we save this schema first 
// (const userSchema) and then pass it in.
module.exports = User