const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profile_url: {type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    active: {type: Boolean, default: false}
});


module.exports = mongoose.model("User", UserSchema);
