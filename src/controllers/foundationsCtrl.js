const Foundation = require("../models/Foundation");
const Categories = require("../models/Categories")

const getFoundations = async (req, res) => {
  try {
    const foundations = await Foundation.find()
      .select("-password")
      .populate("category", "category").lean();

    if (!foundations) return res.status(404).json({ success: false, message: "No hay fundaciones para mostrar" });
    
    const responseData = foundations.map(foundation => {
      const fundsRaised = foundation.allTransactions.filter(transaction => transaction.status === "approved").reduce((total, transaction) => total + transaction.amount, 0);

      const categoryName = Categories.findById(foundation.category)

      return {
        _id: foundation._id,
        foundation_name: foundation.foundation_name,
        profile_url: foundation.profile_url,
        description: foundation.description,
        fundsRaised: fundsRaised,
        category: categoryName,
        targetAmount: foundation.targetAmount,
        allTransactions: foundation.allTransactions
      };
    });

    res.json({ responseData });

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

    const responseData = foundationsFilter.map(foundation => {
      const fundsRaised = foundation.allTransactions.filter(transaction => transaction.status === "approved").reduce((total, transaction) => total + transaction.amount, 0);

      const nameCategory = Categories.findById(foundation.category);

      return {
        _id: foundation._id,
        foundation_name: foundation.foundation_name,
        profile_url: foundation.profile_url,
        description: foundation.description,
        fundsRaised: fundsRaised || 0,
        category: nameCategory,
        targetAmount: foundation.targetAmount,
        allTransactions: foundation.allTransactions
      };
    });

    res.json({ responseData });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getFoundationId = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar la fundación por el ID
    const foundation = await Foundation.findById(id)
      .select("-password")
      .populate("category", "category");
    
    if (!foundation) {
      return res.status(404).json({ error: "Fundación no encontrada" });
    }

    // Calcular el monto recaudado solo de transacciones aprobadas
    const fundsRaised = foundation.allTransactions
      .filter(transaction => transaction.status === "approved")
      .reduce((total, transaction) => total + transaction.amount, 0);

      const nameCategory = Categories.findById(foundation.category);

    // Construir la respuesta
    const responseData = {
      _id: foundation._id,
      foundation_name: foundation.foundation_name,
      profile_url: foundation.profile_url,
      description: foundation.description,
      fundsRaised: fundsRaised || 0,
      category: nameCategory,
      targetAmount: foundation.targetAmount,
      allTransactions: foundation.allTransactions
    };

    res.json(responseData);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
    getFoundations,
    getCategories,
    getFoundationsCategories,
    getFoundationId
}