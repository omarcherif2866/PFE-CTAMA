import express from 'express';
import {countDocument, createDoc, getAllDocuments,getDocumentById,getDocumentsByClient,updateDocStatus} from '../controllers/DocumentsController.js'; // Assurez-vous que le chemin est correct
import upload from '../middlewares/multerPdf.js';

const router = express.Router();

router.post('/deposerDoc', upload.single('doc', 10), createDoc);


router.route('/')
.get(getAllDocuments);

router.route('/count')
.get(countDocument);

router.route('/:id')
.get(getDocumentById)



router.get('/client/:clientId', getDocumentsByClient);

router.put('/status/:id', updateDocStatus);

export default router;