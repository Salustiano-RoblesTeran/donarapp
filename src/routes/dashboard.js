const { Router } = require("express");
const { validateJWT } = require("../middlewares/validate_jwt.js")
const { getFoundation } = require("../controllers/dashboardCtrl.js")


const router = Router();

router.get("/", validateJWT, getFoundation)

module.exports = router;