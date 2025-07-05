import Fournitures from "../models/Fournitures.js";


export async function addOnceFournitures(req, res) {
  try {
    console.log('Données reçues:', req.body);  // Vérifiez si les données sont correctes
    
    // Vérification des données avant insertion
    const { nom,type } = req.body;
    
    if (!nom || !type ) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    // Création de la Fournitures dans la base de données
    const newFournitures = new Fournitures({
      nom,
      type,
    });

    // Enregistrer la Fournitures dans la base de données
    await newFournitures.save();

    // Réponse après insertion réussie
    res.status(201).json({
      id: newFournitures._id,
      nom: newFournitures.nom,
      type: newFournitures.type,
    });
  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de l\'ajout de la Fournitures:', err);
    res.status(500).json({ error: err.message });
  }
}
      
  


    export function getAllFournitures(req, res) {
    Fournitures
      .find({})
  
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
    }

export async function DeleteFournitures(req, res) {
const id = req.params.id;
console.log("ID de la Fournitures à supprimer :", id);  // Vérifiez que l'ID est correct
try {
  const prd = await Fournitures.findByIdAndDelete(id);
  if (!prd) {
    return res.status(404).json({ message: "Fournitures non trouvé" });
  }
  res.status(200).json({ message: "Fournitures supprimé avec succès" });
} catch (error) {
  console.error("Erreur lors de la suppression de la Fournitures :", error);
  res.status(500).json({ error: "Erreur de suppression de la Fournitures" });
}
}


export function getFournituresById(req, res) {
    Fournitures.findById(req.params.id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: "Fournitures non trouvé" });
      }

      res.status(200).json(doc);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération de la Fournitures :", err);
      res.status(500).json({ error: err });
    });
}


export function putOnceFournitures(req, res) {
  let newFournitures = {};

  // Vérification si l'image est présente dans la requête

    newFournitures = {
        nom: req.body.nom,
        type: req.body.type,
    };
  




  const updateData = newFournitures;

 

  console.log('ID du Fournitures:', req.params.id);
  console.log('Données envoyées à la base de données:', updateData);

  // Mise à jour du produit dans la base de données
  Fournitures.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .then((doc1) => {
      if (!doc1) {
        console.log('Fournitures non trouvé');
        return res.status(404).json({ error: 'Fournitures non trouvé' });
      }
      console.log('Fournitures mis à jour:', doc1);
      res.status(200).json(doc1);
    })
    .catch((err) => {
      console.error('Erreur lors de la mise à jour du Fournitures:', err);
      res.status(500).json({ error: err });
    });
}