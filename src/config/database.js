const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("base de Datos conectada");
  } catch (error) {
    console.log(error);
    throw new Error("Error enla coneccion con la DB");
  }
};

module.exports = {
  dbConnection,
};
