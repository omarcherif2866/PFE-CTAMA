import Voitures from "../models/Voiture.js";


export async function addOnceVoiture(req, res) {
  try {
    console.log('Données reçues:', req.body);  // Vérifiez si les données sont correctes
    
    // Vérification des données avant insertion
    const { puissance_fiscale, marque, modele, nbr_portes, num_chas } = req.body;
    
    if (!puissance_fiscale || !marque || !modele || !nbr_portes || !num_chas) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    // Création de la voiture dans la base de données
    const newVoiture = new Voitures({
      puissance_fiscale,
      marque,
      modele,
      nbr_portes,
      num_chas
    });

    // Enregistrer la voiture dans la base de données
    await newVoiture.save();

    // Réponse après insertion réussie
    res.status(201).json({
      id: newVoiture._id,
      puissance_fiscale: newVoiture.puissance_fiscale,
      marque: newVoiture.marque,
      modele: newVoiture.modele,
      nbr_portes: newVoiture.nbr_portes,
      num_chas: newVoiture.num_chas
    });
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de l\'ajout de la voiture:', err);
    res.status(500).json({ error: err.message });
  }
}
      
  


    export function getAllVoitures(req, res) {
    Voitures
      .find({})
  
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
    }

export async function DeleteVoitures(req, res) {
const id = req.params.id;
console.log("ID de la Voiture à supprimer :", id);  // Vérifiez que l'ID est correct
try {
  const prd = await Voitures.findByIdAndDelete(id);
  if (!prd) {
    return res.status(404).json({ message: "Voiture non trouvé" });
  }
  res.status(200).json({ message: "Voiture supprimé avec succès" });
} catch (error) {
  console.error("Erreur lors de la suppression de la Voiture :", error);
  res.status(500).json({ error: "Erreur de suppression de la Voiture" });
}
}


export function getVoituresById(req, res) {
    Voitures.findById(req.params.id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: "Voiture non trouvé" });
      }

      res.status(200).json(doc);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération de la Voiture :", err);
      res.status(500).json({ error: err });
    });
}


export function putOnceVoiture(req, res) {
  let newVoiture = {};

  // Vérification si l'image est présente dans la requête

    newVoiture = {
        puissance_fiscale: req.body.puissance_fiscale,
        marque: req.body.marque,
        modele: req.body.modele,
        nbr_portes: req.body.nbr_portes,
        num_chas: req.body.num_chas
    };
  




  const updateData = newVoiture;

 

  console.log('ID du Voiture:', req.params.id);
  console.log('Données envoyées à la base de données:', updateData);

  // Mise à jour du produit dans la base de données
  Voitures.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .then((doc1) => {
      if (!doc1) {
        console.log('Voiture non trouvé');
        return res.status(404).json({ error: 'Voiture non trouvé' });
      }
      console.log('Voiture mis à jour:', doc1);
      res.status(200).json(doc1);
    })
    .catch((err) => {
      console.error('Erreur lors de la mise à jour du Voiture:', err);
      res.status(500).json({ error: err });
    });
}