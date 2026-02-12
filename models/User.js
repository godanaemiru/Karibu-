const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true,
        enum: ['director', 'manager', 'agent'] 
    },
    branch: { 
        type: String 
    }
});

// EXPORT THE MODEL (This is the part that was missing/causing the error)
module.exports = mongoose.model('User', userSchema);