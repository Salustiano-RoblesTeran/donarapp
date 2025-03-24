const mongoose = require("mongoose");

const schemeCategories = new mongoose.Schema({
    category: { 
        type: String,  
        enum: [
            "Salud",
            "Educación",
            "Medio Ambiente",
            "Pobreza",
            "Derechos Humanos",
            "Protección Animal",
            "Cultura y Arte",
            "Desarrollo Comunitario",
            "Investigación Científica",
            "Emergencias y Desastres Naturales"
        ], 
        default: "Salud" 
    }
})

module.exports = mongoose.model("Categories", schemeCategories);
