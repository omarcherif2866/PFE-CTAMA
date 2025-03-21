import Agences from "../models/Agences.js";

export  function addOnceAgence (req, res){
    Agences.create({
              nom: req.body.nom,
              chefAgence: req.body.chefAgence,
              email: req.body.email,
              numero: req.body.numero,
              adresse: req.body.adresse,
              gouvernorat: req.body.gouvernorat,

  
            })
              .then((newAgence) => {
                
                res.status(200).json({
                  nom: newAgence.nom,
                  chefAgence: newAgence.chefAgence,
                  email: newAgence.email,
                  numero: newAgence.numero,
                  adresse: newAgence.adresse,
                  gouvernorat: newAgence.gouvernorat,

  
                });
              })
              .catch((err) => {
                res.status(404).json({ error: err });
              });
          }

  export function getAllAgence(req, res) {
    Agences
      .find({})
  
      .then(docs => {  
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }

  export const getAgenceByGouvernorat = (req, res) => {
    const gouvernorat = req.params.gouvernorat;
  
    Agences.find({ gouvernorat: gouvernorat })  // Remplacez par votre logique de récupération des agences
      .then((agences) => {
        if (!agences) {
          return res.status(404).json({ message: 'Aucune agence trouvée pour ce gouvernorat.' });
        }
        res.json(agences);  // Renvoie les agences trouvées
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des agences:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
      });
  };
  

  export async function DeleteAgence(req, res) {
    const id =req.params.id
    const act = await Agences.findByIdAndDelete(id);
    res.status(200).json({"message":" Agence deleted"});
  }

  export function getAgenceById(req, res){
    Agences.findById(req.params.id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: "Agences non trouvé" });
      }

      res.status(200).json(doc);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération du Agences :", err);
      res.status(500).json({ error: err });
    });
        }

export function putOnce(req, res) {

  // On commence par définir les données de l'actualité, sans inclure l'image pour l'instant
  let newAgence = {
    nom: req.body.nom,
    chefAgence: req.body.chefAgence,
    email: req.body.email,
    numero: req.body.numero,
    adresse: req.body.adresse,
    gouvernorat: req.body.gouvernorat,
  };



  console.log('ID de l\'Actualité:', req.params.id);
  console.log('Nouvelles données:', newAgence);

  // Mise à jour de l'actualité dans la base de données
  Agences.findByIdAndUpdate(req.params.id, newAgence, { new: true })
    .then((doc1) => {
      if (!doc1) {
        console.log('Actualité non trouvée');
        return res.status(404).json({ error: 'Actualité non trouvée' });
      }
      console.log('Actualité mise à jour:', doc1);
      res.status(200).json(doc1);
    })
    .catch((err) => {
      console.error('Erreur lors de la mise à jour de l\'Actualité:', err);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'Actualité' });
    });
}

export async function countAgences (req, res){
  try {
    const AgencesCount = await Agences.countDocuments({});
    res.json({ AgencesCount });
  } catch (error) {
    console.error('Error counting products:', error);
    res.status(500).json({ message: 'Error counting products' });
  }
};