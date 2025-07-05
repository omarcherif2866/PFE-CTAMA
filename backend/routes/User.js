import express from 'express';
import {

  forgotPassword,
  resetPassword,
  verifyCode,
  getOrdreMissionStats,
  getExpertsGroupedByRegion,
  compterFournitures,
  getDocumentsGroupedByGouvernorat
} from '../controllers/userController.js';

const router = express.Router();

// Middleware pour les en-têtes CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});


router.post('/forgotPassword', forgotPassword);

router.put('/reset-password/:id', resetPassword);

router.post('/verify-code', verifyCode);

router.get('/documents/ordre-mission-stats', getOrdreMissionStats);

router.get('/grouped-by-region', getExpertsGroupedByRegion);

router.get('/sinistre-grouped-by-gouvernorat', getDocumentsGroupedByGouvernorat);


router.get('/compter-fournitures', compterFournitures);

export default router;
