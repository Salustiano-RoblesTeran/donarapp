const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    orderId: {type: String, unique: true, required: true},
    status: {type: String },
    amount: { type: Number, required: true },
    title: { type: String},
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Transaction", transactionSchema);