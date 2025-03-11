const { generateJWT } = require("../helpers/generate-jwt");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({
            message: "El email ya esta registrado"
        })

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado exitosamente", error});
    } catch(error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" })
        
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

            const token = await generateJWT(user._id);

            res.json({token})
    }catch (error) {
        res.status(500).json({ message: "Error en el login", error });
    }
}

module.exports = {
    signUp,
    signIn
}