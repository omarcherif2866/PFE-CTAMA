import express from 'express';
import {

  forgotPassword,
  resetPassword,

} from '../controllers/userController.js';

const router = express.Router();

// Middleware pour les en-têtes CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});


router.post('/forgotPassword', forgotPassword);

router.post('/reset-password', resetPassword);



export default router;
