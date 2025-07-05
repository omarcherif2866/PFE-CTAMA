import FournituresEval from "../models/evaluationFournitures.js";
import mongoose from 'mongoose';

export async function addOnceFournituresEval(req, res) {
  try {
    console.log('Données reçues:', req.body);  // Vérifiez les données reçues

    // Récupération des données
    const { fourniture, prix } = req.body;

    // // Vérification de la validité des champs
    // if (!fourniture || !prix) {
    //   return res.status(400).json({ error: 'Tous les champs sont requis' });
    // }

    // Vérification si l'ID de la fourniture est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(fourniture)) {
      return res.status(400).json({ error: 'ID de fourniture invalide' });
    }

    // Création de l'objet à enregistrer
    const newFournituresEval = new FournituresEval({
      fourniture,
      prix,
    });

    // Sauvegarde dans la base de données
    await newFournituresEval.save();

    // Réponse avec l'objet sauvegardé
    res.status(201).json({
      id: newFournituresEval._id,
      fourniture: newFournituresEval.fourniture,
      prix: newFournituresEval.prix,
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout de la FournituresEval:", err);
    res.status(500).json({ error: err.message });
  }
}

      
  


    export function getAllFournituresEval(req, res) {
    FournituresEval
      .find().populate("fourniture").exec()
  
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
    }