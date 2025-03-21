import Actualite from "../models/actualite.js";

export  function addOnceActualites (req, res){
  const imageFile = req.file;
  if (!imageFile) {
    return res.status(400).json({ message: 'Please upload an image' });
  }
    Actualite.create({
              nom: req.body.nom,
              description: req.body.description,
              image: imageFile.path, // Stocke l'URL de Cloudinary
  
            })
              .then((newActualites) => {
                
                res.status(200).json({
                  nom: newActualites.nom,
                  description: newActualites.description,

  
                });
              })
              .catch((err) => {
                res.status(404).json({ error: err });
              });
          }

  export function getAllActualites(req, res) {
    Actualite
      .find({})
  
      .then(docs => {
        // Map pour ajouter l'URL complète pour chaque image
        const actualiteWithImageUrls = docs.map(doc => {
          if (doc.image) {
            // Vérifie si l'image est stockée sur Cloudinary ou localement
            if (doc.image.startsWith('http')) {
              // Si l'image est déjà une URL (Cloudinary)
              doc.image = doc.image; // Utilise directement l'URL
            } else {
              // Sinon, on construit l'URL pour l'image stockée localement
              doc.image = `http://localhost:9090/img/${doc.image}`; // Remplacez le port et le chemin selon votre configuration
            }
          }
          return doc;
        });
  
        res.status(200).json(actualiteWithImageUrls);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }

  export function getLastThreeActualites(req, res) {
    Actualite
      .find({})
      .sort({ createdAt: -1 }) // Trie les actualités par 'createdAt' en ordre décroissant (les plus récentes en premier)
      .limit(3) // Limite le nombre de résultats à 3
      .then(docs => {
        // Map pour ajouter l'URL complète pour chaque image
        const actualiteWithImageUrls = docs.map(doc => {
          if (doc.image) {
            // Vérifie si l'image est stockée sur Cloudinary ou localement
            if (doc.image.startsWith('http')) {
              // Si l'image est déjà une URL (Cloudinary)
              doc.image = doc.image; // Utilise directement l'URL
            } else {
              // Sinon, on construit l'URL pour l'image stockée localement
              doc.image = `http://localhost:9090/img/${doc.image}`; // Remplacez le port et le chemin selon votre configuration
            }
          }
          return doc;
        });
  
        res.status(200).json(actualiteWithImageUrls);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }


  
  

  export async function DeleteActualites(req, res) {
    const id =req.params.id
    const act = await Actualite.findByIdAndDelete(id);
    res.status(200).json({"message":" Actualites deleted"});
  }

  export function getActualitesById(req, res){
    Actualite.findById(req.params.id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: "actualite non trouvé" });
      }

      // Vérification et mise à jour de l'URL de l'image
      if (doc.image) {
        if (doc.image.startsWith('http')) {
          // L'image est déjà une URL complète (par exemple, Cloudinary)
          doc.image = doc.image;
        } else {
          // L'image est stockée localement, on construit l'URL complète
          doc.image = `http://localhost:9090/images/${doc.image}`; // Ajustez le port et le chemin selon votre configuration
        }
      }

      res.status(200).json(doc);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération du actualite :", err);
      res.status(500).json({ error: err });
    });
        }

export function putOnce(req, res) {
  const imageFile = req.file;

  // On commence par définir les données de l'actualité, sans inclure l'image pour l'instant
  let newActualites = {
    nom: req.body.nom,
    description: req.body.description,
  };

  // Si un fichier image a été envoyé, on met à jour l'image
  if (imageFile) {
    newActualites.image = imageFile.path;
  }

  console.log('ID de l\'Actualité:', req.params.id);
  console.log('Nouvelles données:', newActualites);

  // Mise à jour de l'actualité dans la base de données
  Actualite.findByIdAndUpdate(req.params.id, newActualites, { new: true })
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