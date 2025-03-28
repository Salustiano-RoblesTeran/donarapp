const Foundation = require("../models/Foundation");

const isValidEmail = async (correo) => {
    const emailExists = await Foundation.findOne({ correo });

    if (emailExists) {
        throw new Error(`The email ${correo} already exists in the database!`);
    }
}

module.exports = {
    isValidEmail
}