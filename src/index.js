const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // Makes express parse incoming json so that 
// it becomes available in the request body.

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    // Using async / await:
    try {
        await user.save()
        res.status(201).send(user)
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
app.get('/users', async (req, res) => {
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
// All express methods have the same signature: 1. Route, 2. Callback function
// that uses a request and a response object.
// :id. This is not a field name. We could use any token or string here 
// starting with a colon.
app.get('/users/:id', async (req, res) => {
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
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    
        // res.status(400)  // If user error occurs, status code is set to 400: Bad request.
        // See https://httpstatuses.com for all statuses available.
        // res.status must be called before sending the error!
        // res.send(error)
        // This can be chained together:
})
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})