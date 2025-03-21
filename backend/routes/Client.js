import express from 'express';
import multer from "../middlewares/multer-config.js";
import { signup, signin,  getClientById, getAll, updateClientProfile, putPassword, DeleteUser, countClientsByType, addDevisSinistre, getImagesByClient, getDevisByClient} from '../controllers/ClientController.js';
import upload from '../middlewares/multerPdf.js';


const router = express.Router();


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

router.route('/signup')
.post(
    multer("image"),
    signup)

router.post('/deposerDevis', upload.array('devis', 10), addDevisSinistre);


router.post("/signin", signin);

router.route('/count')
.get(countClientsByType);

router.get("/user/:id", getClientById);

router.get("/user", getAll);

router.route('/user/profile/:id')
.put(
    multer("image"),
    updateClientProfile)
.delete(DeleteUser)

router.route('/user/password/:id')
.put(
    putPassword)

router.get('/image/:clientId', getImagesByClient);

router.get('/devis/:clientId', getDevisByClient);

export default router;
