// Importing dependencies
const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config(); 

// Log environment variables for debugging
console.log("DB Username:", process.env.DB_USERNAME);
console.log("DB Password:", process.env.DB_PASSWORD);
console.log("DB Host:", process.env.DB_HOST);
console.log("DB Name:", process.env.DB_NAME);

const app = express(); // Create an Express application

// Creating a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test the connection
db.connect((err) => {
    if (err) {
        return console.log("Error connecting to the database: ", err);
    }
    console.log("Successfully connected to MySQL: ", db.threadId);
});

// Basic endpoint for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Patients API!');
});

// Retrieve all patients
app.get('/patients', (req, res) => {
    const getPatients = "SELECT * FROM patients";
    db.query(getPatients, (err, data) => {
        if (err) {
            return res.status(400).send("Failed to get patients: " + err);
        }
        res.status(200).json(data); // Use json() to send data as JSON
    });
});

// Retrieve all providers
app.get('/providers', (req, res) => {
    const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers";
    
    // Query the database to get all providers
    db.query(getProviders, (err, data) => {
        if (err) {
            return res.status(400).send("Failed to get providers: " + err);
        }
        // Send the provider data as a JSON response
        res.status(200).json(data);
    });
});

// Retrieve all patients' first names
app.get('/patients/first-names', (req, res) => {
    const getAllFirstNamesQuery = "SELECT first_name FROM patients";

    // Query the database to get all patients' first names
    db.query(getAllFirstNamesQuery, (err, data) => {
        if (err) {
            return res.status(400).send("Failed to retrieve patients' first names: " + err);
        }

        if (data.length === 0) {
            return res.status(404).send("No patients found.");
        }

        // Send the patient first names as a JSON response
        res.status(200).json(data);
    });
});

// Retrieve all providers' specialties
app.get('/providers/provider-specialty', (req, res) => {
    const getAllSpecialtiesQuery = "SELECT DISTINCT provider_specialty FROM providers"; // Query to get unique specialties

    // Query the database to get all provider specialties
    db.query(getAllSpecialtiesQuery, (err, data) => {
        if (err) {
            return res.status(400).send("Failed to retrieve provider specialties: " + err);
        }

        if (data.length === 0) {
            return res.status(404).send("No specialties found.");
        }

        // Send the provider specialties as a JSON response
        res.status(200).json(data);
    });
});



// Start and listen to the server
app.listen(3000, () => {
    console.log('Server is running on port 3000...');
});
