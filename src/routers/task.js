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
    try {
        const tasks = await Task.find({ owner: req.user._id })
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