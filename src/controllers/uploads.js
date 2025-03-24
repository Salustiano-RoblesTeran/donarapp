// const { upload } = require("../config/cloudinary");

// const uploadImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No se subió ninguna imagen" });
//     }

//     res.json({ 
//       message: "Imagen subida con éxito", 
//       imageUrl: req.file.path // URL de la imagen en Cloudinary
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Error al subir la imagen", error });
//   }
// };

// module.exports = { uploadImage };
