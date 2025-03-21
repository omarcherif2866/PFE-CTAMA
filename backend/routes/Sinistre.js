import express from 'express';
import upload from '../middlewares/multerPdf.js';
import { addOnceSinistres, DeleteSinistres, getAllSinistres, getSinistreByDocument, getSinistreByReference, putOnceSinistre, updateSinistresStatus } from '../controllers/Sinistre.js';

const router = express.Router();

router.route('/')
.post(
    addOnceSinistres);

router.route('/')
.get(getAllSinistres);

router.route('/:id')
.delete(DeleteSinistres)

router.route('/:reference')
.put(putOnceSinistre)

router.put('/status/:id', updateSinistresStatus);


router.get('/reference/:reference', getSinistreByReference);

router.get('/document/:documentId', getSinistreByDocument);

export default router;