require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Middleware to enable CORS

// Band Schema and Model
const bandSchema = new mongoose.Schema({
    name: String,
    country: String,
    website: String,
    facebook: String,
    instagram: String,
    dayOfWeek: String,
    year: Number,
});

const Band = mongoose.model('Band', bandSchema);

// Create (POST method)
app.post('/bands', async (req, res) => {
    try {
        const newBand = new Band(req.body);
        await newBand.save();
        res.status(201).send(newBand);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read All Bands (GET method)
app.get('/bands', async (req, res) => {
    try {
        const bands = await Band.find({});
        res.status(200).send(bands);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read Single Band (GET method)
app.get('/bands/:id', async (req, res) => {
    try {
        const band = await Band.findById(req.params.id);
        if (!band) {
            return res.status(404).send();
        }
        res.status(200).send(band);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update (PUT method)
app.put('/bands/:id', async (req, res) => {
    try {
        const band = await Band.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!band) {
            return res.status(404).send();
        }
        res.send(band);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete (DELETE method)
app.delete('/bands/:id', async (req, res) => {
    try {
        const band = await Band.findByIdAndDelete(req.params.id);
        if (!band) {
            return res.status(404).send();
        }
        res.send(band);
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
