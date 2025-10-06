const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

// Initialize our Express app
const app = express();

// Connect to the database
connectDB();

// --- Middlewares ---
// This allows our server to accept JSON data in requests
app.use(express.json());
// This allows our frontend to make requests to our backend
app.use(cors());


// --- API Routes ---
// When a request comes to '/api/auth', it will be handled by our auth routes.
app.use('/api/auth', require('./routes/auth'));
// When a request comes to '/api/tasks', it will be handled by our task routes.
app.use('/api/tasks', require('./routes/tasks'));


// Define the port our server will run on.
// It will try to use a port from the environment variables, or 3000 if that's not set.
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
