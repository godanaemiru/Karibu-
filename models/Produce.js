const mongoose = require('mongoose');

const produceSchema = new mongoose.Schema({
    produceName: { type: String, required: true }, // Alphanumeric check handled in frontend/route
    type: { type: String, required: true, minlength: 2 }, 
    date: { type: Date, required: true },
    tonnage: { type: Number, required: true, min: 100 }, // Assuming 3 chars = min 100kg
    cost: { type: Number, required: true, min: 10000 }, // Assuming 5 chars = min 10,000 UgX
    dealerName: { type: String, required: true, minlength: 2 },
    branch: { type: String, required: true, enum: ['Maganjo', 'Matugga'] },
    contact: { type: String, required: true }, // Validation via Regex in route
    sellingPrice: { type: Number, required: true },
    status: { type: String, default: 'Available' }
});

module.exports = mongoose.model('Produce', produceSchema);