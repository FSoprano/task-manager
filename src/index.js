const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json()) // Makes express parse incoming json so that 
// it becomes available in the request body.

app.use(userRouter)
app.use(taskRouter)




app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

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
