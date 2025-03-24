const Category = require("../models/Categories"); // Importa el modelo de categorías

const { dbConnection } = require("../config/database");

const categories = [
    "Salud",
    "Educación",
    "Medio Ambiente",
    "Pobreza",
    "Derechos Humanos",
    "Protección Animal",
    "Cultura y Arte",
    "Desarrollo Comunitario",
    "Investigación Científica",
    "Emergencias y Desastres Naturales"
];

const loadCategories = async () => {
    try {
        // Conectar a la base de datos
        await dbConnection();

        // Verificar si ya existen categorías en la base de datos
        const existingCategories = await Category.find();

        if (existingCategories.length === 0) {
            // Si no existen categorías, insertarlas
            const categoryDocuments = categories.map(category => ({ category }));
            await Category.insertMany(categoryDocuments);
            console.log("Categorías cargadas correctamente en la base de datos.");
        } else {
            console.log("Las categorías ya están en la base de datos.");
        }
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
};

// Ejecutar la función para cargar las categorías
loadCategories();
