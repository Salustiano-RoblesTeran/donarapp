// const cloudinary = require("cloudinary").v2;
// const dotenv = require("dotenv");
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configurar Multer Storage con Cloudinary
// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: "uploads", // Nombre de la carpeta en Cloudinary
//       format: async (req, file) => "png", // Puedes cambiarlo a "jpeg", "jpg", etc.
//       public_id: (req, file) => Date.now() + "-" + file.originalname,
//     },
//   });
  
//   const upload = multer({ storage });

//   module.exports = { cloudinary, upload };
