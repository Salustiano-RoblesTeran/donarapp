const mongoose = require("mongoose");

const FundationSchema = new mongoose.Schema({
    fundation_name: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profile_url: {type: String },
    description: { type: String, required: true },
    password: { type: String, required: true },
    fundsRaised: { type: Number, default: 0 },
    targetAmount: { type: Number, require: true },
    allTransactions: [{
        status: { type: String, required: true },
        amount: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: false },
        date: { type: Date, default: Date.now}
    }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Categories", required: true }
});


module.exports = mongoose.model("Fundation", FundationSchema);
