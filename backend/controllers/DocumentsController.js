import mongoose from 'mongoose';
import Documents from '../models/Document.js'; // Assurez-vous que le chemin est correct

export const createDoc = async (req, res) => {
    try {
      const { client, expert, description } = req.body;
    
      console.log('Client:', client);
      console.log('Expert:', expert);
    
      // Récupère le nom du fichier PDF uploadé (un seul fichier)
      const pdfName = req.file.filename; // Récupère seulement le nom du fichier
    
      // Crée un nouveau document
      const newDoc = new Documents({
        client: client,
        expert: expert || null,
        description: description,
        doc: pdfName,  // Pas une liste, juste un fichier
        status: 'En attente', // Par défaut, en attente

      });
    
      // Sauvegarde le document dans la base de données
      const savedDoc = await newDoc.save();
      res.status(201).json(savedDoc);
    } catch (error) {
      // Capture et renvoie les erreurs
      console.error('Erreur lors de la création du document :', error);
      res.status(500).json({ error: error.message });
    }
  };

  

  export function getAllDocuments(req, res) {
    Documents
      .find({})
  
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
    }

    export const getDocumentsByClient = async (req, res) => {
      try {
        // Vérifie si l'ID est bien une chaîne et un ObjectId valide
        const clientId = req.params.clientId;
        
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
          return res.status(400).json({ message: 'ID client invalide' });
        }
    
        // Recherche les documents associés au client
        const documents = await Documents.find({ client: new mongoose.Types.ObjectId(clientId) });
    
        if (!documents || documents.length === 0) {
          return res.status(404).json({ message: 'Aucun document trouvé pour ce client' });
        }
    
        // Retourne les documents trouvés
        res.status(200).json(documents);
      } catch (error) {
        console.error('Erreur lors de la récupération des documents :', error);
        res.status(500).json({ error: error.message });
      }
    };

export const updateDocStatus = async (req, res) => {
  const { id } = req.params; 
  const { status } = req.body;

  try {
    // Vérifie si le statut est valide
    const validStatuses = ['En attente', 'Validé', 'Non Validé'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    // Trouve et met à jour le statut de la commande
    const doc = await Documents.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Renvoie le document mis à jour
    )

    if (!doc) {
      return res.status(404).json({ message: 'document non trouvé' });
    }

    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error });
  }
}

export const getDocumentById = async (req, res) => {
  try {
    const document = await Documents.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }
    res.status(200).json(document);
  } catch (error) {
    console.error('Erreur lors de la récupération du document:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du document' });
  }
};