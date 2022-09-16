const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    // Using async / await:
    try {
        await user.save()
        // sendWelcomeEmail(user.email, user.name)
        // We know the user has an email because the validation before 
        // save() worked.
        const token = await user.generateAuthToken()
        // Generate an authentication for the signup user. Mind the lowercase 
        // 'user': This is a token for a particular user, not a lookup in the 
        // collection of users (User).
        // The function is defined in the user model (models/user.js) file.
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch(error => {
    //     // res.status(400)  // If user error occurs, status code is set to 400: Bad request.
    //     // See https://httpstatuses.com for all statuses available.
    //     // res.status must be called before sending the error!
    //     // res.send(error)
    //     // This can be chained together:
    //     res.status(400).send(error)
    // })
})
// New route for signing up:
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // findByCredentials: we can also define our own function here.
        // This function is defined in the user model (models/user.js).
        const token = await user.generateAuthToken()
        // Generate an authentication for the login user. Mind the lowercase 
        // 'user': This is a token for a particular user, not a lookup in the 
        // collection of users (User).
        // The function will be defined in the user model (models/user.js) file.
        res.send( { user, token })
        // Return the user and the token.
        // We don't want to return the password and the tokens array though.
        // So we're gonna hide that information by not returning the entire 
        // user object. Instead, we assgin a function to the user key. This 
        // function, getPublicProfie, is defined in the user.js model file,
        // then removed again and replaced with the toJSON method.
    } catch (e) {
        res.status(400).send()
    }
    /* Only 2 routes will be publicly available: "Create user" and "Login". All others require an 
    authentication. We use JSON web tokens for that.
    */
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token // we set req.token in auth.js
            // token.token: the tokens array is a list of token objects, 
            // each of which has a _id and a token key/value pair.
            // We address the token value here. (token highlighted orange here: a single object in the array
            // that is iterated over, and of that we look at the token value. Hence token.token.
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

/* The following route allows a logged in user to list the details of 
all other users. This not something we want to support. Instead, the user 
should be able to see his own information only.
router.get('/users', auth, async (req, res) => {
    // auth: Add middleware function to this route, moving the route request 
    // to 3rd place in the list of arguments. Can thus add middleware authentication 
    // to selected routes.
    const users = await User.find({})

    try {
        if (!users) {
            return res.status(404).send()
        }
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send()
    }
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send(e)
    //     // 500 is an internal server error.
    //     // Remember, if Mongoose cannot find anything, that is still 
    //     // considered a success. Hence a 404 would make no sense here.
    // })
})
*/
/* The above route allows a logged in user to list the details of 
all other users. This not something we want to support. Instead, the user 
should be able to see his own information only. We achieve this as 
follows: */
router.get('/users/me', auth, async (req, res) => {
    // /users/me will get the logged in user's profile (just this user's 
    // information)
    // No need to look up and fetch the user because the auth token already 
    // has that information (see auth.js). So all we need is:
    res.send(req.user)
})

// All express methods have the same signature: 1. Route, 2. Callback function
// that uses a request and a response object.
// :id. This is not a field name. We could use any token or string here 
// starting with a colon.
// The next route is not needed anymore; a user should not be able to 
// fetch another user's data by ID, just her or his own. This however is already 
// done by the /users/me route above. Since get /users/:id requires authentication,
// we make things easy and just remove it.
/* router.get('/users/:id', async (req, res) => {
        console.log(req.params) 
        // To get any param info out on the console, send a GET request 
        // from Postman that goes to localhost:3000/users/344555 (some random number)
        // The request will be running endlessly, and console output will be written.
        // This output shows key value pairs in the req.params object.
        const id0 = req.params.id  // How do we know this? Well, we just check 
        // the console.log output from above!

        try {
            const user = await User.findById(id0)
            if (!user) {
                return res.status(404).send()
            }
            res.send(user)
        } catch (e) {
            res.status(500).send()
        }
        // User.findById(id0).then((user) => {
        //     // Mongoose automatically converts the given string to an object ID.
        //     // Nice!
        //     if (!user) {
        //         // Handles the case that nothing is found, which is, remember,
        //         // a success!
        //         // Use a 12-digit number as the ID to test this. This is the 
        //         // length of a Mongo object ID. Otherwise Mongo will try to 
        //         // cast the number to a String and you get a 500 error.
        //         return res.status(404).send()
        //         // return stops the function execution.
        //     }
        //     res.send(user)
        // }).catch((e) => {
        //     res.status(500).send(e)
        // })
})
*/
router.patch('/users/me', auth, async (req, res) => {
    // patch() is for updating an existing resource.
    // Hint: properties that do not exist are ignored. The record is returned when found, but a non-exisiting 
    // property will not be added. 
    // To provide the user with information about that:
    const updates = Object.keys(req.body) // Adds each req.body key as a value to an array.
    const allowedUpdates = [ 'name', 'age', 'email', 'password'] // An array of all keys that are allowed to be updated.
    const isAllowedUpdate = updates.every((update) => allowedUpdates.includes(update))
    // The good old every iterator; it checks if each key in the updates array is included in the allowedUpdates
    // array. If so, then the specified key to update is valid.
    if (!isAllowedUpdate) {
        // If the specified update key is invalid:
        return res.status(400).send('Invalid update!')
    }
    try {
        // for the password hashing, we need to change something here
        // because currently, findByIdAndUpdate bypasses mongoose. 
        // It performs a direct operation on the database. This means the
        // the pre() method we need for password hashing is not executed.
        // So the change is (old code line commented out below):
        // const user = await User.findById(req.user._id) // Not needed anymore.
        // See delete route.
        // await req.user._id.fetch()
        updates.forEach((update) => {
            req.user[update] = req.body[update]
            // Object notation does not work here because we don't 
            // know the name of the property to be updated beforehand.

        })
        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        
        // we use req.body because we want this route to work for all IDs.
        // Converting incoming IDs to req.body: mongoose takes care of that.
        // The 3rd argument to findByIdAndUpdate is a bunch of options one can set in an object. new: true will
        // display the user record with the updates already applied. runValidators ensures that the validators 
        // that were set up are run; i.e. that a record cannot be updated with wrong values.
        /* if (!user) {
            return res.status(404).send()
        } */ // Not needed anymore. See delete route.
        res.send(req.user)
    } catch (e) {
        // 2 possibilities here: 1. Validation error 2. Server error (500)
        res.status(400).send(e)
    } 
})
router.delete('/users/me', auth, async (req, res) => {
    // replace /users/:id with /users/me. Even an authenticated user 
    // should not be able to delete another user's profile by ID.
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // req.params.id no longer exists. We have to replace it with 
        // req.user._id. Remember: We added the user to the request object in
        // auth.js, and we have access to it from here because we use the 
        // auth method.
        // The more elegant method, however, is:
        await req.user.remove()
        // sendCancellationEmail(req.user.email, req.user.name)
        /* if (!user) {
            return res.status(404).send()
        } */
        // The if-block is not needed anymore since we don't look up a user's 
        // ID anymore. Just the login user can delete her or his own profile.
        res.send(req.user) // user -> req.user (we don't have a standalone user 
        // variable anymore)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }

})

// File upload challenge:
// For explanations, see index.js.
const upload = multer({
    // dest: 'avatars', If we delete dest, multer will pass the uploaded data back to the route handler that calls multer, 
    // so that we can deal with the data in other ways (save it to the database).
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
            return cb(new Error ('Please upload an image file!'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // Commenting out req.user.avatar = req.file.buffer because 
    // we will have sharp do something to the image before we upload it.
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer

    // req.file.buffer is where the uploaded image data of a request is. Assigning it to req.user.avatar, we assign the 
    // database destination.
    await req.user.save() // Saving any uploaded image to the database.
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    // To delete an avatar, set req.user.avatar to 'undefined' 
    // database destination.
    await req.user.save() // Overwriting the existing avatar data 
    // in the database with the 'undefined' setting. This should 
    // remove the avatar field.
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
// Showing an uploaded image if there is one:
router.get('/users/:id/avatar', async (req, res) => {
    // There might be a chance that the user is not found, or that 
    // she has no image associated. That's why we use a try/catch block.

    try {
        const user = await User.findById(req.params.id)
        // If the user is not found or has no avatar:
        if (!user || !user.avatar) {
            throw new Error()
        }
        // we need to tell the server (Express) what type of 
        // data it is getting back or how to interpret it. 
        // Remember we stored it in base64 (binary data)
        res.set('Content-Type', 'image/jpg') // What you get is a jpeg image
        // sending the image
        res.send(user.avatar)
        // URL to show image will be something like:
        // http://localhost:3000/users/62c2fe448b45ee4126ae9321/avatar
        // Note that Postman probably cannot return the image in the 
        // correct format, so don't use Postman for the request.
    }
    catch (e) {
        res.status(404).send()
    }
} )

module.exports = router