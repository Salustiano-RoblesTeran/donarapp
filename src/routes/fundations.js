const { Router } = require("express");
const { getFundations, getCateogires, getFundationsCategories } = require("../controllers/fundationsCtrl");

const router = Router();

router.get("/", getFundations)

router.get("/categories", getCateogires);

router.get("/filter", getFundationsCategories)

module.exports = router;