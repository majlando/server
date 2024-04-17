/* 
* RESTful API for managing data about bands
* Express for handling HTTP requests
* Mongoose for interacting with MongoDB
* CORS for enabling Cross-Origin Resource Sharing
* dotenv for loading environment variables from a .env file
* Made by René Majland
*/

// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express application
const app = express();

// Connect to MongoDB using the connection URI from environment variables
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))  // Log success message on successful connection
  .catch(err => console.log(err));               // Log error message if connection fails

// Middleware to parse JSON bodies (this is needed for POST and PUT requests)
app.use(express.json());
// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Define a Mongoose schema for bands
const bandSchema = new mongoose.Schema({
    name: String,
    country: String,
    website: String,
    facebook: String,
    instagram: String,
    dayOfWeek: String,
    year: Number,
});

// Create a Mongoose model for the bandSchema
const Band = mongoose.model('Band', bandSchema);

// Route to create a new band entry (POST method)
app.post('/bands', async (req, res) => {
    try {
        const newBand = new Band(req.body);  // Create a new Band instance with request body
        await newBand.save();                // Save the new band to the database
        res.status(201).send(newBand);       // Send back the created band with a 201 status code
    } catch (error) {
        res.status(400).send(error);         // Send a 400 status code if an error occurs
    }
});

// Route to retrieve all bands, sorted by year descending and name ascending
app.get('/bands', async (req, res) => {
    try {
        const bands = await Band.find({}).sort({year: -1, name: 1});
        res.status(200).send(bands);         // Send the retrieved bands with a 200 status code
    } catch (error) {
        res.status(500).send(error);         // Send a 500 status code if an error occurs
    }
});

// Route to retrieve a single band by its ID
app.get('/bands/:id', async (req, res) => {
    try {
        const band = await Band.findById(req.params.id);
        if (!band) {
            return res.status(404).send();   // Send a 404 status code if no band found
        }
        res.status(200).send(band);          // Send the retrieved band with a 200 status code
    } catch (error) {
        res.status(500).send(error);         // Send a 500 status code if an error occurs
    }
});

// Route to update a band entry (PUT method)
app.put('/bands/:id', async (req, res) => {
    try {
        const band = await Band.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!band) {
            return res.status(404).send();   // Send a 404 status code if no band found for update
        }
        res.send(band);                      // Send the updated band
    } catch (error) {
        res.status(400).send(error);         // Send a 400 status code if an error occurs
    }
});

// Route to delete a band entry
app.delete('/bands/:id', async (req, res) => {
    try {
        const band = await Band.findByIdAndDelete(req.params.id);
        if (!band) {
            return res.status(404).send();   // Send a 404 status code if no band found to delete
        }
        res.send(band);                      // Confirm deletion
    } catch (error) {
        res.status(500).send(error);         // Send a 500 status code if an error occurs
    }
});

// Define the port number to listen on, defaulting to 5000 if not specified
const PORT = process.env.PORT || 5000;
// Start the server on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
