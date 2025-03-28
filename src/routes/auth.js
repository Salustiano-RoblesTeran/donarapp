const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate_fields');

const { isValidEmail } = require('../helpers/db_validators');
const { validateJWT } = require('../middlewares/validate_jwt');
const { signUp, signIn, isAuthenticate } = require('../controllers/auth');

const router = Router();

router.post("/sign-up", 
    [
        check("name", "El nombre es obligatorio").notEmpty(),
        check("email", "El correo no es valido!").isEmail(),
        check("email", "El campo es obligatorio!").notEmpty(),
        check("email").custom(isValidEmail),
        check("password", "La contraseña debe tener como mínimo 6 caracteres").isLength({ min: 6 }),
    ], signUp
);

router.post("/Sign-in", 
    [
        check("email", "El correo no es valido!").isEmail(),
        check("email", "El campo es obligatorio!").notEmpty(),
        check("password", "El campo es obligatorio!").notEmpty(),
        validateFields
    ], signIn

)

router.get("/", validateJWT, isAuthenticate);

module.exports = router;