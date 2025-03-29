const { Router } = require("express");
const { getFoundations, getCategories, getFoundationsCategories, getFoundationId  } = require("../controllers/foundationsCtrl");

const router = Router();

router.get("/", getFoundations)

router.get("/categories", getCategories);

router.get("/filter", getFoundationsCategories)

router.get("/:id", getFoundationId)

module.exports = router;