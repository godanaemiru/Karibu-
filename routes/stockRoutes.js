const express = require('express');
const router = express.Router();
const Produce = require('../models/Produce');

// POST: Add New Stock (Procurement)
router.post('/add', async (req, res) => {
    try {
        const newProduce = new Produce(req.body);
        await newProduce.save();
        res.json({ message: "Stock Added Successfully", data: newProduce });
    } catch (err) {
        res.status(400).json({ message: "Failed to add stock", error: err.message });
    }
});

// GET: Fetch Stock (For Manager Table & Sales Dropdown)
router.get('/', async (req, res) => {
    try {
        const { branch } = req.query;
        let query = { status: 'Available' };
        if(branch) query.branch = branch;

        const stock = await Produce.find(query);
        res.json(stock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;