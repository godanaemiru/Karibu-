const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Produce = require('../models/Produce');

// POST: Record a Sale & Update Stock
router.post('/add', async (req, res) => {
    try {
        const { produceName, tonnage, amountPaid, buyerName, agentName, branch, type, nin, dueDate } = req.body;
        
        const tonnageSold = parseInt(tonnage);

        // 1. FIND THE PRODUCE (Must match Name and Branch)
        const stockItem = await Produce.findOne({ 
            produceName: produceName, 
            branch: branch,
            status: 'Available' 
        });

        if (!stockItem) {
            return res.status(404).json({ message: "Item not found or out of stock in this branch." });
        }

        // 2. CHECK AVAILABILITY
        if (stockItem.tonnage < tonnageSold) {
            return res.status(400).json({ 
                message: `Insufficient Stock! Only ${stockItem.tonnage}kg available.` 
            });
        }

        // 3. DEDUCT STOCK
        stockItem.tonnage -= tonnageSold;
        
        // If stock hits 0, mark as Out of Stock
        if (stockItem.tonnage <= 0) {
            stockItem.status = "Out of Stock";
        }
        
        // Save the updated stock back to DB
        await stockItem.save(); 

        // 4. RECORD THE SALE
        const newSale = new Sale({
            produceId: stockItem._id,
            produceName,
            tonnageSold,
            amountPaid,
            buyerName,
            salesAgent: agentName,
            branch,
            type, // Cash or Credit
            nin,       // Optional (Credit only)
            dueDate    // Optional (Credit only)
        });

        await newSale.save();

        res.json({ message: "Sale Recorded & Stock Updated", newStockLevel: stockItem.tonnage });

    } catch (err) {
        res.status(500).json({ message: "Transaction Failed", error: err.message });
    }
});

// GET: Sales History (Keep your existing route)
// GET: Sales History
// If '?limit=10' is passed, it returns the last 10 (for Agent Dashboard).
// If NO limit is passed, it returns ALL sales (for Director Report).
router.get('/history', async (req, res) => {
    try {
        const { branch, limit } = req.query; 
        const query = branch ? { branch: branch } : {};
        
        let salesQuery = Sale.find(query).sort({ saleDate: -1 });

        // Only apply limit if it is provided (e.g. for Agent Dashboard)
        if(limit) {
            salesQuery = salesQuery.limit(parseInt(limit));
        }

        const sales = await salesQuery;
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET: Analytics (Keep your existing route)
router.get('/analytics', async (req, res) => {
    try {
        const revenue = await Sale.aggregate([
            { $group: { _id: "$branch", totalRevenue: { $sum: "$amountPaid" } } }
        ]);
        
        const produce = await Sale.aggregate([
            { $group: { _id: "$produceName", totalTonnage: { $sum: "$tonnageSold" } } }
        ]);

        res.json({ revenue, produce });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;