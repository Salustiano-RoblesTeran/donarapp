const Fundation = require("../models/Fundation");
const Categories = require("../models/Categories")

const getFundations = async (req, res) => {
  try {
    const fundation = await Fundation.find()
      .select("-password")
      .populate("category", "category"); 

    if (!fundation) return res.status(404).json({ success: false, message: "No hay fundaciones para mostrar" });

    res.json({ success: true, fundation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getCateogires = async (req, res) => {
  try {
    const allCategories = await Categories.find();
    res.json({allCategories})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getFundationsCategories = async (req, res) => {
  try {
    const { category } = req.query;

    const fundationsFilter =  await Fundation.find({ category });
    res.json({ fundationsFilter })

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getFundationId = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar la fundación por el ID
    const fundation = await Fundation.findById(id).select("-password").populate("category", "category");
    
    if (!fundation) {
      return res.status(404).json({ error: 'Fundación no encontrada' });
    }


    // Devolver la fundación y el monto recaudado
    res.json({ fundation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
    getFundations,
    getCateogires,
    getFundationsCategories,
    getFundationId
}