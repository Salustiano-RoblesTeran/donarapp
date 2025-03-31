const Foundation = require("../models/Foundation");
const Categories = require("../models/Categories")

const getFoundations = async (req, res) => {
  try {
    const foundation = await Foundation.find()
      .select("-password")
      .populate("category", "category"); 

    if (!foundation) return res.status(404).json({ success: false, message: "No hay fundaciones para mostrar" });
    
    let fundsRaised = foundation.allTransactions.filter(transaction => transaction.status === "approved").reduce((total, transaction) => total + transaction.amount, 0);

    // Estructurar la respuesta con solo los campos requeridos
    const responseData = {
      foundation_name: foundation.foundation_name,
      profile_url: foundation.profile_url,
      description: foundation.description,
      fundsRaised: fundsRaised || 0,
      targetAmount: foundation.targetAmount,
      allTransactions: foundation.allTransactions
    };
  
      res.json({ responseData })

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

    let fundsRaised = foundationsFilter.allTransactions
    .filter(transaction => transaction.status === "approved") 
    .reduce((total, transaction) => total + transaction.amount, 0);

    // Estructurar la respuesta con solo los campos requeridos
    const responseData = {
        foundation_name: foundationsFilter.foundation_name,
        profile_url: foundationsFilter.profile_url,
        description: foundationsFilter.description,
        fundsRaised: fundsRaised || 0,
        targetAmount: foundationsFilter.targetAmount,
        allTransactions: foundationsFilter.allTransactions
    };

    res.json({ responseData })

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

    let fundsRaised = foundation.allTransactions
    .filter(transaction => transaction.status === "approved") 
    .reduce((total, transaction) => total + transaction.amount, 0);

    // Estructurar la respuesta con solo los campos requeridos
      const responseData = {
        foundation_name: foundationsFilter.foundation_name,
        profile_url: foundationsFilter.profile_url,
        description: foundationsFilter.description,
        fundsRaised: fundsRaised || 0,
        targetAmount: foundationsFilter.targetAmount,
        allTransactions: foundationsFilter.allTransactions
      };
  
      res.json({ responseData })
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