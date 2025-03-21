import express from 'express';
import multer from "../middlewares/multer-config.js";
import { addOnceActualites, DeleteActualites, getActualitesById, getAllActualites, getLastThreeActualites, putOnce } from '../controllers/Actualite.js';


const router = express.Router();


router.route('/')
.get(getAllActualites);

router.route('/lastThree')
.get(getLastThreeActualites);

router.route('/')
.post(
    multer("image"),
    addOnceActualites);


router.route('/:id')
.get(getActualitesById)
.delete(DeleteActualites)
.put(
    multer("image"),
    putOnce)



export default router;
