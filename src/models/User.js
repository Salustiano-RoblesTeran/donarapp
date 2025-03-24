const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fundation_name: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profile_url: {type: String },
    description: { type: String, required: true },
    password: { type: String, required: true },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    totalRaised: { type: Number},
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Categories", required: true }
});


module.exports = mongoose.model("User", UserSchema);
