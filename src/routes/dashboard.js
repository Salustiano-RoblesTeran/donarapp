const { Router } = require("express");
const { validateJWT } = require("../middlewares/validate_jwt.js")
const { getFundation } = require("../controllers/dashboardCtrl.js")


const router = Router();

router.get("/", validateJWT, getFundation)

module.exports = router;