import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement

// Configurer Cloudinary avec les informations de ton compte
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Définir le stockage avec Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images", // Dossier de destination sur Cloudinary
    format: async (req, file) => {
      const MIME_TYPES = {
        "image/jpg": "jpg",
        "image/jpeg": "jpg",
        "image/png": "png",
      };
      const mimeType = file.mimetype;
      const extension = mimeType.split("/")[1];
      return MIME_TYPES[mimeType] || extension; // Utilise l'extension correspondant au MIME type
    },
    public_id: (req, file) => {
      const name = file.originalname.split(" ").join("_").split(".")[0];
      return `${name}-${Date.now()}`; // Nom de fichier avec timestamp
    },
  },
});

// Exporter le middleware Multer avec le stockage Cloudinary
// export default function (image, size) {
//   return multer({
//     storage: storage,
//     limits: {
//       fileSize: size, // Limite de taille
//     },
//     fileFilter: (req, file, cb) => {
//       const MIME_TYPES = {
//         "image/jpg": "jpg",
//         "image/jpeg": "jpg",
//         "image/png": "png",
//       };
//       if (MIME_TYPES[file.mimetype]) {
//         cb(null, true); // Accepter le fichier
//       } else {
//         cb(new Error("Format de fichier non pris en charge"), false); // Rejeter les fichiers non valides
//       }
//     },
//   }).single(image);
// }
export default function (image, size, isArray = false) {
  return multer({
    storage: storage,
    limits: {
      fileSize: size, // Limite de taille (ex: 5MB)
    },
    fileFilter: (req, file, cb) => {
      const MIME_TYPES = {
        "image/jpg": "jpg",
        "image/jpeg": "jpg",
        "image/png": "png",
      };
      if (MIME_TYPES[file.mimetype]) {
        cb(null, true); // Accepter le fichier
      } else {
        cb(new Error("Format de fichier non pris en charge"), false); // Rejeter les fichiers non valides
      }
    },
  })[isArray ? "array" : "single"](image, 10); // Permet d'utiliser array si `isArray` est vrai
}

