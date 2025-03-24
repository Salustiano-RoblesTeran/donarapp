const User = require("../models/User");
const Categories = require("../models/Categories")

const getFundations = async (req, res) => {
  try {
    const user = await User.find()
      .select("-password")
      .populate("category", "category"); 

    if (!user) return res.status(404).json({ success: false, message: "No hay usuarios para mostrar" });

    res.json({ success: true, user });
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

    const fundationsFilter =  await User.find({ category });
    res.json({ fundationsFilter })

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    getFundations,
    getCateogires,
    getFundationsCategories
}