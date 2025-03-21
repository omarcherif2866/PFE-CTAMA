import express from 'express';
import multer from "../middlewares/multer-config.js";
import {signin,  getUserById, getAll, updateUserProfile,putPassword, DeleteUser, addExpert, affecterExpert, addImagesSinistre, getImagesByExpert, deleteImageSinistre, getDevisByExpert, countExperts, ajouterImageAfterAccident} from '../controllers/Expert.js';


const router = express.Router();


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});



router.route('/')
.post(
    multer("image"),
    addExpert)

    
router.post("/signin", signin);

router.route('/count')
.get(countExperts);

router.get("/user", getAll);


router.post('/affecter-expert', affecterExpert);

router.get("/:id", getUserById);



router.route('/:id')
.put(
    multer("image"),
    updateUserProfile)

  

router.route('/delete/:id')
.delete(DeleteUser)


router.route('/user/password/:id')
.put(
    putPassword)


router.post('/add', 
multer("image", 5 * 1024 * 1024, true), // Utilisez true pour activer le mode array
addImagesSinistre
);


router.get('/image/:expertId', getImagesByExpert);
    
router.get('/devis/:expertId', getDevisByExpert);

router.delete('/delete/:imageId', deleteImageSinistre);

router.post('/ajouter-image-after-accident/:sinistreId', 
    multer("imageAfterAccident", 5 * 1024 * 1024, true), // Utilisez true pour activer le mode array
    ajouterImageAfterAccident
    );
export default router;
