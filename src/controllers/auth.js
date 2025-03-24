const { generateJWT } = require("../helpers/generate-jwt");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Categories = require("../models/Categories");

const signUp = async (req, res) => {
    const { fundation_name, name, last_name, email, profile_url, category, description, password } = req.body;

    try {
        // Verificar si el nombre de la fundación ya existe
        const fundationExist = await User.findOne({ fundation_name });
        if (fundationExist) return res.status(400).json({ message: "El nombre de la fundación ya está registrado." });

        // Verificar si el email ya está registrado
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "El email ya está registrado" });

        // Verificar que la categoría exista
        const categoriaExiste = await Categories.findById(category);
        if (!categoriaExiste) {
            return res.status(400).json({ message: "Categoría no válida" });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = new User({
            fundation_name,
            name,
            last_name,
            email,
            profile_url,
            category,
            description,
            password: hashedPassword
        });

        

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado exitosamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error: error.message });
    }
};


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