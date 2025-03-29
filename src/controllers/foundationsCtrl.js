const Foundation = require("../models/Foundation");
const Categories = require("../models/Categories")

const getFoundations = async (req, res) => {
  try {
    const foundation = await Foundation.find()
      .select("-password")
      .populate("category", "category"); 

    if (!foundation) return res.status(404).json({ success: false, message: "No hay fundaciones para mostrar" });

    res.json({ success: true, foundation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getCategories = async (req, res) => {
  try {
    const allCategories = await Categories.find();
    res.json({allCategories})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getFoundationsCategories = async (req, res) => {
  try {
    const { category } = req.query;

    const foundationsFilter =  await Foundation.find({ category }).select("-password").populate("category", "category"); ;
    res.json({ foundationsFilter })

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getFoundationId = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar la fundación por el ID
    const foundation = await Foundation.findById(id).select("-password").populate("category", "category");
    
    if (!foundation) {
      return res.status(404).json({ error: 'Fundación no encontrada' });
    }


    // Devolver la fundación y el monto recaudado
    res.json({ foundation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
    getFoundations,
    getCategories,
    getFoundationsCategories,
    getFoundationId
}