const { generateJWT } = require("../helpers/generate-jwt");
const Foundation = require("../models/Foundation");
const bcrypt = require("bcryptjs");
const Categories = require("../models/Categories");

const signUp = async (req, res) => {
    const { foundation_name, name, last_name, email, profile_url, category, targetAmount, description, password } = req.body;
    
    try {
        
        // Validar campos requeridos
        if (!foundation_name || !name || !last_name || !email || !category || !description || !password || !targetAmount) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        // Verificar si el nombre de la fundación ya existe
        const foundationExist = await Foundation.findOne({ foundation_name });
        if (foundationExist) {
            return res.status(400).json({ message: "El nombre de la fundación ya está registrado." });
        }

        // Verificar si el email ya está registrado
        const mailExist = await Foundation.findOne({ email });
        if (mailExist) {
            return res.status(400).json({ message: "El email ya está registrado." });
        }

        // Verificar que la categoría exista
        const categoriaExist = await Categories.findById(category);
        if (!categoriaExist) {
            return res.status(400).json({ message: "Categoría no válida." });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newFoundation = new Foundation({
            foundation_name,
            name,
            last_name,
            email,
            profile_url,
            category,
            description,
            targetAmount,
            password: hashedPassword,
            totalRaised: 0
        });

        await newFoundation.save();
        res.status(201).json({ message: "Fundación registrada exitosamente." });

    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: "Error al registrar fundación", error: error.message });
    }
};


const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundation = await Foundation.findOne({ email });
        if (!foundation) return res.status(404).json({ message: "Fundacion no encontrado" })
        
            const isMatch = await bcrypt.compare(password, foundation.password);
            if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

            const token = await generateJWT(foundation._id);

            res.json({token})
    }catch (error) {
        res.status(500).json({ message: "Error en el login", error });
    }
}

const isAuthenticate = async (req, res) => {
    try {
        const { id } = req.foundation;
        
        const foundation = await Foundation.findById(id);

        if (foundation) {
            return res.json({ message: 'Fundación encontrada', success: true });
        } else {
            return res.status(404).json({ message: 'Fundación no encontrada', success: false });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor', success: false });
    }
}

module.exports = {
    signUp,
    signIn,
    isAuthenticate
}