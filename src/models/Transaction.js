const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    fundationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
