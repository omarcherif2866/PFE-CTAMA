import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: (req, file) => {
      const ext = file.originalname.split('.').pop();
      const name = file.originalname.replace(/\.[^/.]+$/, '');
      return `${name}-${Date.now()}`;
    }
  },
});

export default multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    cb(null, allowed.includes(file.mimetype));
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});