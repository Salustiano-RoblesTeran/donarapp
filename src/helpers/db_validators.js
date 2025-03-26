const Fundation = require("../models/Fundation");

const isValidEmail = async (correo) => {
    const emailExists = await User.findOne({ correo });

    if (emailExists) {
        throw new Error(`The email ${correo} already exists in the database!`);
    }
}

module.exports = {
    isValidEmail
}