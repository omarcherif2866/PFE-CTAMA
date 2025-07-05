import express from 'express';
import { addOnceFournitures, DeleteFournitures, getAllFournitures, getFournituresById, putOnceFournitures } from '../controllers/fournitures.js';


const router = express.Router();


router.route('/')
.get(getAllFournitures);




router.route('/')
.post(
    addOnceFournitures);


router.route('/:id')
.delete(DeleteFournitures)
.get(getFournituresById)
.put(
    putOnceFournitures)



export default router;

