const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    produceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produce' },
    produceName: String,
    tonnageSold: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    buyerName: { type: String, required: true, minlength: 2 },
    salesAgent: { type: String, required: true },
    saleDate: { type: Date, default: Date.now },
    branch: String
});

module.exports = mongoose.model('Sale', saleSchema);