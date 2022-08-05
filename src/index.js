const app = require('./app')
const port = process.env.PORT

// We factored out the definition of the Express server (see app.js) so that we can also use the server 
// for testing with supertest, that is, without starting the server by means of an 
// app.listen() call. The behavior of the development application does not change by this;
// we still call index.js to start the server on localhost.

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// File upload: We want to give users an option to upload a profile picture.
// const multer = require('multer')  // Multer is a library for file uploads
// const upload = multer({
//     dest: 'images',   // Name of folder to contain images
//     limits: {
//         fileSize: 1000000  // This is in bytes.
//     },
//     fileFilter(req, file, cb) {
//         // cb = callback function
//         if(!file.originalname.match(/\.(doc|docx)$/)) {
//             //.match checks regex. Search for ., then doc or docx, $ makes sure 
//             // that the string ends with doc or docx.
//             // To check for a single file extension, use .endsWith rather than
//             // .match
//             // Regex checker on regex101.com
//             return cb(new Error('Please upload a Word document!'))
//         }
//         cb(undefined, true)
//         // cb(new Error, ('File must be PDF')) // In case of wrong file type
//         // cb(undefined, true) // If things are OK, and upload can be expected
//         // cb(undefined, false) // Generally reject upload, actually not used here.
//     }
// })


// // Route endpoint for uploads:
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()    // .single() is a multer function; it takes a string argument.
//     // The string argument is just a freely-chosen name. This is what we need 
//     // to provide as the key in the request body for the file upload. The 
//     // request body needs to be of type form-data!
// }, (error, req, res, next) => {
//     // Run another function to return a brief JSON message in case 
//     // of an error rather than a lengthy HTML document.
//     // It is important to specify all 4 arguments, so that Express 
//     // knows it's about errors.
//     res.status(400).send({error: error.message})

// })



// Authentication
// We need Express middleware to authenticate user actions (by using tokens)
// without middleware: new request -> run route handler
// with middleware: new request -> do something -> run route handler
// do something: check if there's a valid authentication token.

// The 'do something':
/* app.use((req, res, next) => {
    // console.log(req.method, req.path)
    // print the request method (GET, POST etc.) and the route path to the screen.
    // Need to call next() or otherwise the request will not be continued.
    // next()
    if (req.method === 'GET') {
        res.send('GET requests are disabled.')
    } else {
        next()
    }
}) */

/* // Challenge: create a middleware function for maintenace mode that temporarily 
// disables all requests
// 1. Register the function.
// 2. Send back a maintenance message with a 503 status code
// 3. Try the requests from the server and confirm status / messages.

app.use((req, res, next) => {
   // No req.method if-block necessary! This will always run. 
  res.status(503).send('The service is currently unavailable. Please try again later.')
})
*/
// middleware functions from now on outsourced to separate files in 
// 'middleware' folder.


// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
    
//     //const task = await Task.findById('627d02aa1884c3b2114d5766')
//     //await task.populate('owner') // This populates the task.owner with data 
//     // from the referenced user profile.
//     //console.log(task.owner)

//     // To find the a user, and then the task belonging to that user:
//     const user = await User.findById('627e573917531596afc47c43')
//     await user.populate('tasks') // The stuff from the virtual field in the User model.
//     console.log(user.tasks)
// }
// main()

// Secure passwords with bcryptjs (basics):
// const bcrypt = require('bcryptjs')
// const myFunction = async () => {
//     const password = 'Red12345!'
//     const hashedPassword = await bcrypt.hash(password, 8)
//     // bcryptjs returns a promise.
//     // 8 is the number of hashing rounds
//     console.log(password)
//     console.log(hashedPassword)
//     /* Difference between encryption algorithms and hashing algorithms:
//     Encryption algorithms are reversible; hashing algorithms are not. 
//     With hashing, you won't get the original value back. */
//     // Checking the password:
//     const isMatch = await bcrypt.compare('Red12345!', hashedPassword)
//     console.log(isMatch) // Should return 'true'
// }
// myFunction()

// JSON web token basics:
// const jwt = require('jsonwebtoken')
// const myFunction = async () => {
   // const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days'})
    // jwt.sign takes 3 arguments, an object, a string, and another object.
    // The object contains the data embedded in the token.
    // What we need is an identifier of the login user. 
    // The user ID (_id:) value in the Mongo DB fits perfectly.
    // At first, we set this to a dummy user ID: abc123.
    // The 2nd argument (string) is a secret string used to sign the token, to make
    // sure it has not been tampered with. Any line of characters will do.
    // The 3rd argument is an objects where one can set extra values.
    // We use the expiresIn key here, to make the token expire. Note the 
    // bizarre string notation of the value.
    // console.log(token) // Prints the token to the screen.
    // The token consists of 3 parts separated by dots. The 1st part is the header.
    // It is a base 64-encoded JSON string which says what type of token it is 
    // and by which algorithm it was generated. The 2nd part is the body or payload. It contains 
    // the data that was provided (here; user ID) as a base64-encoded JSON string. The 3rd part is the signature 
    // that is used to verify the token.
    // To test a token: base64decode.org

    // To verify the token:
    // const data = jwt.verify(token, 'thisismynewcourse')
    // 1st argument is the token you want to verify; 2nd is the secret used 
    // to sign (you need an exact match here!)
    // console.log(data) // Returns the token and an "Issued at" (iat) value, 
    // which is a timestamp.
//}
// myFunction()
