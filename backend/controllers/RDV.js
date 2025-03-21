import RDV from "../models/RDV.js";

export  function addOnceRDV (req, res){
    console.log('Données reçues:', req.body); 
    const ownedBy = req.params.ownedBy;

RDV.create({
          description: req.body.description,
          date: req.body.date,
          heure: req.body.heure,
          ownedBy: ownedBy,
          receiver: req.body.receiver,

        })
          .then((newRDV) => {
            
            res.status(200).json(newRDV);
          })
          .catch((err) => {
            res.status(404).json({ error: err });
          });
}

export function getAllRDVs(req, res) {
    RDV
    .find({}).populate('receiver')

    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export async function DeleteRDV(req, res) {
    const id =req.params.id
    const prd = await RDV.findByIdAndDelete(id);
    res.status(200).json({"message":" RDVs deleted"});
}

export function putOnce(req, res) {
       // Préparer les données pour la mise à jour
       let newRDV = {
        description: req.body.description,
        date: req.body.date,
        heure: req.body.heure,

      };
    
      // Log des données reçues
      console.log('ID de la RDV:', req.params.id);
      console.log('Nouvelles données:', newRDV);
      console.log('Body:', req.body);
      
      // Mise à jour du RDV dans la base de données
      RDV.findByIdAndUpdate(req.params.id, newRDV, { new: true })
        .then((doc1) => {
          if (!doc1) {
            console.log('RDV non trouvé');
            return res.status(404).json({ error: 'RDV non trouvé' });
          }
          console.log('RDV mis à jour:', doc1);
          res.status(200).json(doc1);
        })
        .catch((err) => {
          console.error('Erreur lors de la mise à jour du RDV:', err);
          res.status(500).json({ error: err.message });
        });
}

export function getRDVsByCriteria(req, res) {
    const { ownedBy, receiver: receiverUser } = req.query;
  
    // Assurez-vous que les valeurs sont définies
    if (!ownedBy && !receiverUser) {
      return res.status(400).json({ message: 'Les critères de recherche ne sont pas définis.' });
    }
  
    // Requête avec condition logique OR
    RDV.find({
      $or: [
        { ownedBy: ownedBy },
        { receiver: receiverUser }
      ]
    })
    .populate('ownedBy').populate('receiver')
      .then(docs => {
        res.status(200).json(docs);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }