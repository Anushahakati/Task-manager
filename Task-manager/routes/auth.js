const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../db');

const router = express.Router();

// ROUTE 1: Register a new user (POST /api/auth/register)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Scramble the password into a secret code (hash)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Save the new user to the database
        // <-- THIS IS THE ONLY LINE THAT CHANGED. 'UserName' is now 'Name'.
        await sql.query`INSERT INTO Users (Name, Email, PasswordHash) VALUES (${name}, ${email}, ${passwordHash})`;

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error during registration');
    }
});

// ROUTE 2: Login a user (POST /api/auth/login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Find the user by their email
        const result = await sql.query`SELECT * FROM Users WHERE Email = ${email}`;
        const user = result.recordset[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the provided password matches the secret code in the database
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If everything is correct, create a "Magical VIP Pass" (JWT)
        const payload = {
            user: {
                id: user.UserId,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // The pass expires in 5 hours
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send the pass back to the user
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error during login');
    }
});

module.exports = router;

