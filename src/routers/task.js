const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,     // spread operator, copies everything from req.body
        owner: req.user._id // plus owner. Compare old code (commented out). 
        // We have access to req.user because
        // we use the auth method.
    })
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
router.get('/tasks', auth, async (req, res) => {
    // This one is ideal for extra functions like filtering, 
    // pagination, and sorting because it is the only one that fetches 
    // a long list of items, many of which are irrelevant, such as 
    // completed tasks.
    // Most of these functions use the query string, for example:
    // GET /tasks?completed=false => fetches just the incomplete tasks
    // GET /tasks?limit=10 => Limits the returned list to 10 hits
    // GET /tasks?limit=10?skip=10 => Returns 10 hits per page, start on the
    // second page (because the first 10 hits = 1st page are skipped).

    const findTask = { owner: req.user._id }
    
    if (req.query.completed) {
        // match.completed = req.query.completed
        // This won't work because true and false in the query strings are strings, 
        // rather than Boolean values. To get a Boolean out of this:
        
            findTask.completed = req.query.completed === 'true'
    } 
    const findOptions = {
        limit: parseInt(req.query.limit), 
        skip: parseInt(req.query.skip)
     }

    try {
       // According to the Mongoose documentation find is looking for the parameters in this order:  
       // conditions, [projections], [options], [callback]
       // So you have to set projections to null.
        const tasks = await Task.find( findTask, null, findOptions )
       
        res.send(tasks)
        // alternative solution:
        // await req.user.populate('tasks')
        // res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findById(_id)
        // We want to make sure a user can only list tasks (s)he has created. We therefore have to change the way we look for 
        // a task; findById won't do:
        const task = await Task.findOne({ _id, owner: req.user._id }) // 1st arg is task ID, second is user ID. Both need to match the information 
        // in the task object.

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'description', 'completed']
    const isAllowedUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isAllowedUpdate) {
        res.status(400).send('Invalid task update')
    }
    try {
        const task = await Task.findOne( { _id: req.params.id, owner: req.user._id })
        
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update]) // Shorthand notation, just one line.
            // Object notation does not work here because we don't 
            // know the name of the property to be updated beforehand.
        
        await task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }

})
module.exports = router