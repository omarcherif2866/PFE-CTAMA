
import express from 'express';
import { generatePDF,extractTextFromPDF,generateRapportPDF, uploadImages, getRapportByExpert, getAllRapports } from '../controllers/expertise.js';
import localUpload from '../middlewares/multer-local.js'; // le chemin peut varier selon ton arborescence


const router = express.Router();


router.get('/generate-pdf/:id', async (req, res) => {
    try {
      const documentId = req.params.id;
      const pdfPath = await generatePDF(documentId);
      res.download(pdfPath);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

  router.route('/extraire-pdf/:id')
  .get(extractTextFromPDF);  



  router.post('/', (req, res, next) => {
    const formData = req.body;
    console.log("Données reçues:", formData); // Ajoutez ce log
    
    // Vérifiez que les données requises sont présentes
    if (!formData) {
        return res.status(400).json({ error: 'Aucune donnée reçue' });
    }
    
    generateRapportPDF(formData, res).catch((error) => {
        // Si les en-têtes n'ont pas encore été envoyés, on peut envoyer une réponse d'erreur
        if (!res.headersSent) {
            res.status(500).json({ error: 'Erreur lors de la génération du PDF', message: error.message });
        } else {
            // Si les en-têtes ont déjà été envoyés, on peut seulement terminer la réponse
            console.error('Erreur après envoi des en-têtes:', error);
            res.end();
        }
    });
});

router.get('/', getAllRapports);

router.get('/expert/:expertId', getRapportByExpert);


router.post('/upload', 
  localUpload.array('images', 10),
  uploadImages
);


export default router;
