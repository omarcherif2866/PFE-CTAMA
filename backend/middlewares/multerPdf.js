import multer from 'multer';
import { extname, join } from 'path';

const MIME_TYPES = {
  "application/pdf": "pdf",
};

const destination = join(process.cwd(), 'public', 'pdfs');

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + '.' + extension); // Append the extension to the filename
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Seuls les fichiers PDF sont autorisés'));
    }
    cb(null, true);
  }
});

export default upload;
