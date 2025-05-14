import mongoose from 'mongoose';
import DevisSinistres from '../models/devisSinistre.js'; // Assurez-vous que le chemin est correct


export function getAllDevisSinistres(req, res) {
    DevisSinistres
      .find({})
      .populate('expert')    // Charge l'objet complet de l'expert
      .populate('client')    // Charge l'objet complet du client
      .populate('documents') // Charge l'objet complet des documents
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
  