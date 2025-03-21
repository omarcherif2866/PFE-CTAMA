import express from 'express';
import { addOnceAgence, countAgences, DeleteAgence, getAgenceByGouvernorat, getAgenceById, getAllAgence, putOnce } from '../controllers/Agences.js';


const router = express.Router();


router.route('/')
.get(getAllAgence);

router.route('/count')
.get(countAgences);

router.route('/')
.post(
    addOnceAgence);
    
router.route('/gouvernorat/:gouvernorat')
.get(getAgenceByGouvernorat);

router.route('/:id')
.get(getAgenceById)
.delete(DeleteAgence)
.put(
    putOnce)




export default router;
