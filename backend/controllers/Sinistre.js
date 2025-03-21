import mongoose from 'mongoose';
import Sinistres from '../models/Sinistre.js'; // Assurez-vous que le chemin est correct
import  {generateUniqueReference}  from './utils/reference.js'; // Importez la fonction

export async function addOnceSinistres(req, res) {
    try {
      console.log('Données reçues:', req.body);  // Vérifiez si les données sont correctes
      
      // Vérification des données avant insertion
      const { date_survenance, date_declaration, num_police, objet_assure, description, documents } = req.body;
      const reference = generateUniqueReference(); // Fonction pour générer une référence unique
  

      
      // Création du sinistre dans la base de données
      const newSinistre = new Sinistres({
        date_survenance,
        date_declaration,
        num_police,
        objet_assure,
        description,
        reference,
        status: 'déclaration',
        documents: documents 

      });
  
      // Enregistrer le sinistre dans la base de données
      await newSinistre.save();
  
      // Réponse après insertion réussie
      res.status(201).json({
        id: newSinistre._id,
        date_survenance: newSinistre.date_survenance,
        date_declaration: newSinistre.date_declaration,
        num_police: newSinistre.num_police,
        objet_assure: newSinistre.objet_assure,
        description: newSinistre.description,
        status: newSinistre.status,
        reference: newSinistre.reference,
      });
    } catch (err) {
      // Gestion des erreurs
      console.error('Erreur lors de l\'ajout du sinistre:', err);
      res.status(500).json({ error: err.message });
    }
  }

  

  export function getAllSinistres(req, res) {
    Sinistres
      .find({})
  
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
    }



export const updateSinistresStatus = async (req, res) => {
  const { id } = req.params; 
  const { status } = req.body;

  try {
    // Vérifie si le statut est valide
    const validStatuses = ['déclaration', 'expertise', 'reglement'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    // Trouve et met à jour le statut de la commande
    const doc = await Sinistres.findByIdAndUpdate(
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



export async function DeleteSinistres(req, res) {
const id = req.params.id;
console.log("ID de la Sinistre à supprimer :", id);  // Vérifiez que l'ID est correct
try {
  const prd = await Sinistres.findByIdAndDelete(id);
  if (!prd) {
    return res.status(404).json({ message: "Sinistre non trouvé" });
  }
  res.status(200).json({ message: "Sinistre supprimé avec succès" });
} catch (error) {
  console.error("Erreur lors de la suppression de la Sinistre :", error);
  res.status(500).json({ error: "Erreur de suppression de la Sinistre" });
}
}


export function putOnceSinistre(req, res) {
  // Validation des données
  const { date_survenance, date_declaration, num_police, objet_assure, description, status, reference, documents } = req.body;
  
  if (!date_survenance || !date_declaration || !num_police || !objet_assure || !status || !reference) {
      return res.status(400).json({ error: 'Toutes les informations nécessaires doivent être fournies.' });
  }

  // Création de l'objet à mettre à jour
  let newSinistre = {
    date_survenance,
    date_declaration,
    num_police,
    objet_assure,
    description,
    status,
    reference,
    documents,
  };

  // Mise à jour du sinistre dans la base de données en utilisant la référence
  console.log('Référence du Sinistre:', req.params.reference);
  console.log('Données envoyées à la base de données:', newSinistre);

  Sinistres.findOneAndUpdate({ reference: req.params.reference }, newSinistre, { new: true })
    .then((updatedSinistre) => {
      if (!updatedSinistre) {
        console.log('Sinistre non trouvé');
        return res.status(404).json({ error: 'Sinistre non trouvé' });
      }
      console.log('Sinistre mis à jour:', updatedSinistre);
      res.status(200).json(updatedSinistre);
    })
    .catch((err) => {
      console.error('Erreur lors de la mise à jour du Sinistre:', err);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    });
}

export async function getSinistreByReference(req, res) {
    try {
      const { reference } = req.params;
  
      // Vérifie si la référence est fournie
      if (!reference) {
        return res.status(400).json({ 
          message: 'La référence du sinistre est requise' 
        });
      }
  
      // Recherche le sinistre par sa référence
      const sinistre = await Sinistres.findOne({ reference });
  
      // Si aucun sinistre n'est trouvé avec cette référence
      if (!sinistre) {
        return res.status(404).json({ 
          message: 'Aucun sinistre trouvé avec cette référence' 
        });
      }
  
      // Retourne le sinistre trouvé
      res.status(200).json(sinistre);
  
    } catch (error) {
      console.error('Erreur lors de la recherche du sinistre:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la recherche du sinistre',
        error: error.message 
      });
    }
  }

  export const getSinistreByDocument = async (req, res) => {
    try {
        const { documentId } = req.params;

        if (!documentId || !mongoose.Types.ObjectId.isValid(documentId)) {
            return res.status(400).json({ message: "L'ID du document est invalide" });
        }

        // Recherche du sinistre lié au document avec conversion en ObjectId
        const sinistre = await Sinistres.findOne({ documents: new mongoose.Types.ObjectId(documentId) });

        if (!sinistre) {
            return res.status(404).json({ message: "Aucun sinistre trouvé pour ce document" });
        }

        res.status(200).json(sinistre);
    } catch (error) {
        console.error("Erreur lors de la récupération du sinistre :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};