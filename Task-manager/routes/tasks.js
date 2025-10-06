const express = require('express');
const { sql } = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// We put our "bouncer" middleware here.
// Every route defined in this file will now require a valid token.
router.use(authMiddleware);

// ROUTE 1: Get all tasks for the logged-in user (GET /api/tasks)
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Tasks WHERE UserId = ${req.user.id}`;
        res.json(result.recordset);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ROUTE 2: Add a new task (POST /api/tasks)
router.post('/', async (req, res) => {
    const { title, description, dueDate, priority, status } = req.body;
    if (!title || !status) {
        return res.status(400).json({ message: 'Title and status are required' });
    }

    try {
        await sql.query`INSERT INTO Tasks (UserId, Title, Description, DueDate, Priority, Status) VALUES (${req.user.id}, ${title}, ${description}, ${dueDate}, ${priority}, ${status})`;
        res.status(201).json({ message: 'Task created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ROUTE 3: Update a task (PUT /api/tasks/:id)
router.put('/:id', async (req, res) => {
    const { title, description, dueDate, priority, status } = req.body;
    const taskId = req.params.id;

    try {
        // First, check if the task belongs to the logged-in user
        const taskResult = await sql.query`SELECT * FROM Tasks WHERE TaskId = ${taskId} AND UserId = ${req.user.id}`;
        if (taskResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found or user not authorized' });
        }
        
        // If it belongs to the user, update it
        await sql.query`UPDATE Tasks SET Title = ${title}, Description = ${description}, DueDate = ${dueDate}, Priority = ${priority}, Status = ${status} WHERE TaskId = ${taskId}`;
        res.json({ message: 'Task updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// ROUTE 4: Delete a task (DELETE /api/tasks/:id)
router.delete('/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
         // First, check if the task belongs to the logged-in user
        const taskResult = await sql.query`SELECT * FROM Tasks WHERE TaskId = ${taskId} AND UserId = ${req.user.id}`;
        if (taskResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Task not found or user not authorized' });
        }

        // If it belongs to the user, delete it
        await sql.query`DELETE FROM Tasks WHERE TaskId = ${taskId}`;
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
