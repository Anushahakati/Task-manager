// Use the 'dotenv' package to read secret variables from the .env file
require('dotenv').config();

// Import the mssql library
const sql = require('mssql');

// This is the configuration for the database connection.
// It reads the secret values from your .env file.
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10), // Reads the port from .env
    options: {
        trustServerCertificate: true, // For local development
    },
};

// This function tries to connect to the database using the dbConfig object.
const connectDB = async () => {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to MSSQL Database successfully!');
    } catch (err) {
        console.error('Database connection failed!', err);
        // Exit the process if the connection fails
        process.exit(1);
    }
};

// Export the sql object and connectDB function to be used in other files
module.exports = { sql, connectDB };