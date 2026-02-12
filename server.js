const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Ensure this is required

// Import Routes
const stockRoutes = require('./routes/stockRoutes');
const salesRoutes = require('./routes/salesRoutes');
const authRoutes = require('./routes/authRoutes'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.static(path.join(__dirname, 'public'))); 

// Database Connection
// Use the secure cloud database string, OR local if testing
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kgl_database')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.use('/api/stock', stockRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes); 

// Default Redirect
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ... other imports