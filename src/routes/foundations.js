const { Router } = require("express");
const { getFoundations, getCateogires, getFoundationsCategories, getFoundationId  } = require("../controllers/fundationsCtrl");

const router = Router();

router.get("/", getFoundations)

router.get("/categories", getCateogires);

router.get("/filter", getFoundationsCategories)

router.get("/:id", getFoundationId)

module.exports = router;