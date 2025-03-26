const { Router } = require("express");
const { getFundations, getCateogires, getFundationsCategories, getFundationId    } = require("../controllers/fundationsCtrl");

const router = Router();

router.get("/", getFundations)

router.get("/categories", getCateogires);

router.get("/filter", getFundationsCategories)

router.get("/:id", getFundationId)

module.exports = router;