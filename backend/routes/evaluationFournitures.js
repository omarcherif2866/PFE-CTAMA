import express from 'express';
import { addOnceFournituresEval, getAllFournituresEval } from '../controllers/evaluationFournitures.js';


const router = express.Router();


router.route('/')
.get(getAllFournituresEval);




router.route('/')
.post(
    addOnceFournituresEval);



export default router;

