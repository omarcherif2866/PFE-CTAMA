import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadPath = path.join(process.cwd(), 'public', 'images');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    // Utiliser le nom d'origine du fichier
    const ext = path.extname(file.originalname); // Obtenir l'extension du fichier
    const originalName = path.basename(file.originalname, ext); // Obtenir le nom sans extension

    // Générer un nom unique en cas de conflit en ajoutant un timestamp
    const fileName = `${originalName}-${Date.now()}${ext}`;
    cb(null, fileName); // Utilisation du nom original + timestamp pour éviter les conflits
  }
});

export default multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    cb(null, allowed.includes(file.mimetype)); // Vérification des types de fichiers autorisés
  },
  limits: { fileSize: 10 * 1024 * 1024 } // Limite de taille à 5MB
});
