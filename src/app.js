const express = require('express')
require('./db/mongoose')

// With the definition of the Express server in this file (a separate module),
// we can use this definition for our local application (dev) and for supertest.
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()

app.use(express.json()) // Makes express parse incoming json so that 
// it becomes available in the request body.

app.use(userRouter)
app.use(taskRouter)

// we don't need to define a port here because supertest does not need one; it does not start
// the server. So const port = process.env.PORT has been deleted.

module.exports = app