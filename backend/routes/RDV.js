import express from 'express';
import upload from '../middlewares/multerPdf.js';
import { addOnceRDV, DeleteRDV, getAllRDVs, getRDVsByCriteria, putOnce } from '../controllers/RDV.js';


const router = express.Router();


router.route('/')
.get(getAllRDVs);




router.post('/addRDV/:ownedBy', upload.none(), addOnceRDV);


router.route('/:id')
.delete(DeleteRDV)
.put(
    putOnce)

router.get('/filter', getRDVsByCriteria); // Route pour récupérer les projets par critères

export default router;