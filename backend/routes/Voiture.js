import express from 'express';
import { addOnceVoiture, DeleteVoitures, getAllVoitures, getVoituresById, putOnceVoiture } from '../controllers/Voiture.js';


const router = express.Router();


router.route('/')
.get(getAllVoitures);




router.route('/')
.post(
    addOnceVoiture);


router.route('/:id')
.delete(DeleteVoitures)
.get(getVoituresById)
.put(
    putOnceVoiture)



export default router;

