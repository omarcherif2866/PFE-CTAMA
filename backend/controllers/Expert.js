import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary'; // Assurez-vous que c'est bien importé

import Experts from '../models/Expert.js'; 
import Client from '../models/Client.js'; 
import Documents from '../models/Document.js'; 
import ImageSinistres from '../models/imageSinistre.js'; 
import { validationResult } from "express-validator";
import DevisSinistres from '../models/devisSinistre.js';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { sendEmail, sendSMS } from './utils/mailing.js';


const jwtsecret = "mysecret";

const generateHashedPassword = async (motdepasse) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(motdepasse, saltRounds);
  return hashedPassword;
};



const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!process.env.jwt_Secret) {
      return res.status(500).json({ message: 'JWT secret key is missing' });
    }

    const user = await Experts.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "Experts Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(password, Experts.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: Experts._id }, process.env.jwt_Secret, {
      expiresIn: 31557600, // 24 hours
    });

    req.session.token = token;

    res.status(200).json({
      _id: Experts._id,
      nom: Experts.nom,
      email: Experts.email,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error signing in' });
  }
};



export function getUserById(req, res) {
  const userId = req.params.id;

  Experts.findById(userId)
    .then((doc) => {
      if (!doc) {
        // Gérer le cas où l'utilisateur n'est pas trouvé
        return res.status(404).json({ message: 'Experts non trouvé' });
      }

      if (doc.image) {
        // Si doc.image contient le nom du fichier, construis l'URL complète
        doc.image = cloudinary.url(doc.image); // Utiliser uniquement le nom de fichier
        console.log("doc.image:", doc.image)
      }

      res.status(200).json(doc);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération de l'utilisateur :", err);
      res.status(500).json({ error: err });
    });
}


export async function updateUserProfile(req, res) {
  try {
    // Extraire les champs du corps de la requête
    const {nom,prenom, email, password, confirmPassword, phoneNumber, region,
      taux,  } = req.body;

    // Préparer l'objet à mettre à jour
    let updateData = {nom, prenom, email, phoneNumber, region,
      taux,  };

    // Gérer le fichier image si présent
    if (req.file) {
      console.log('File received:', req.file);
      updateData.image = req.file.path; // Utiliser le chemin Cloudinary
    }

    // Vérifier si le mot de passe doit être mis à jour
    if (password && password === confirmPassword) {
      // Hacher le nouveau mot de passe avant de le stocker
      updateData.password = await bcrypt.hash(password, 8);
    } else if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await Experts.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // Répondre en fonction du résultat
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil utilisateur' });
  }
}


const putPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    const user = await Experts.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    Experts.password = hashPassword;
    Experts.resetPasswordToken = undefined;
    Experts.resetPasswordExpires = undefined;

    await Experts.save();

    return res.json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export function getAll(req, res) {
  Experts.find({})
  .then(docs => {
    // Mapper les documents pour ajouter l'URL de l'image
    const usersWithImages = docs.map(doc => {
      if (doc.image) {
        // Construire l'URL complète pour l'image
        doc.image = cloudinary.url(doc.image); // Utiliser uniquement le nom de fichier
      }
      return doc; // Retourner le document modifié
    });

    res.status(200).json(usersWithImages);
  })
  .catch(err => {
    res.status(500).json({ error: err });
  });
}




export async function DeleteUser(req, res) {
  const id =req.params.id
  const prd = await Experts.findByIdAndDelete(id);
  res.status(200).json({"message":" user deleted"});
}




export async function addExpert(req, res) {
  try {
    console.log("Données reçues :", req.body); // Debug

    const { nom, prenom, email, password, phoneNumber, region, taux, clients, documents } = req.body;

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: 'Veuillez télécharger une image' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newExpert = new Experts({
      nom,
      prenom,
      email,
      taux,
      region,
      password: hashedPassword,
      phoneNumber,
      image: imageFile.path,
      clients: clients ? clients : [], // Liste des clients affectés (optionnel)
      documents: documents ? documents : [] // Liste des documents affectés (optionnel)
    });

    await newExpert.save();

    console.log('Expert ajouté avec succès:', newExpert);
    return res.status(201).json(newExpert);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'expert:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}


export async function affecterExpert(req, res) {
  try {
    const { expertId, clientId, documentId } = req.body;

    // Vérification des entités
    const expert = await Experts.findById(expertId);
    if (!expert) return res.status(404).json({ message: "Expert non trouvé" });

    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    // Vérifier si le client est une PersonnePhysique ou PersonneMorale
    let clientNom = "Client inconnu";
    if (client.typeClient === "PersonnePhysique") {
      const personnePhysique = await mongoose.model("PersonnePhysique").findById(clientId);
      if (personnePhysique) {
        clientNom = personnePhysique.nom;
      }
    } else if (client.typeClient === "PersonneMorale") {
      const personneMorale = await mongoose.model("PersonneMorale").findById(clientId);
      if (personneMorale) {
        clientNom = personneMorale.matricule_fiscal;
      }
    }

    const document = await Documents.findById(documentId);
    if (!document) return res.status(404).json({ message: "Document non trouvé" });

    // Mise à jour du document
    document.expert = expertId;
    document.client = clientId;
    await document.save();

    // Mise à jour des relations
    if (!expert.documents.includes(documentId)) expert.documents.push(documentId);
    if (!expert.clients.includes(clientId)) expert.clients.push(clientId);
    await expert.save();

    if (!client.experts.includes(expertId)) client.experts.push(expertId);
    if (!client.documents.includes(documentId)) client.documents.push(documentId);
    await client.save();

    // Préparation des messages
    const expertMessage = `Bonjour ${expert.nom}, vous avez été affecté au document ${document.doc} pour le client ${clientNom}.`;
    const clientMessage = `Bonjour ${clientNom}, un expert (${expert.nom}) a été affecté à votre document ${document.doc}.`;

    // Gestion des notifications par promesses concurrentes
    const notificationPromises = [];

    // Ajout des envois d'emails aux promesses
    try {
      notificationPromises.push(
        sendEmail(
          expert.email,
          'Affectation en tant qu\'expert',
          `${expertMessage}\n\nVeuillez consulter votre espace pour plus d'informations.\n\nCordialement,\nL'équipe.`
        )
      );

      notificationPromises.push(
        sendEmail(
          client.email,
          'Affectation d\'un expert',
          `${clientMessage}\n\nVeuillez consulter votre espace pour plus d'informations.\n\nCordialement,\nL'équipe.`
        )
      );
    } catch (emailError) {
      console.error("Erreur lors de l'envoi des emails:", emailError);
      // On continue l'exécution même si les emails échouent
    }

    // Ajout des envois de SMS aux promesses
    try {
      notificationPromises.push(sendSMS(expert.phoneNumber, expertMessage));
      notificationPromises.push(sendSMS(client.phoneNumber, clientMessage));
    } catch (smsError) {
      console.error("Erreur lors de l'envoi des SMS:", smsError);
      // On continue l'exécution même si les SMS échouent
    }

    // Attendre toutes les notifications (emails + SMS)
    await Promise.allSettled(notificationPromises);

    res.status(200).json({ 
      message: "Expert affecté avec succès, notifications envoyées", 
      document 
    });

  } catch (error) {
    console.error("Erreur lors de l'affectation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}


export const addImagesSinistre = async (req, res) => { 
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Données invalides", errors: errors.array() });
    }

    const { expertId, clientId, documentId } = req.body;

    // Vérification des données requises
    if (!expertId || !clientId || !documentId) {
      return res.status(400).json({ message: "Données manquantes (expertId, clientId ou documentId)" });
    }

    // Vérifier si des images ont été envoyées
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Veuillez télécharger au moins une image" });
    }

    // Vérifier si les entités existent
    const [expertExists, clientExists, documentExists] = await Promise.all([
      Experts.findById(expertId),
      Client.findById(clientId),
      Documents.findById(documentId)
    ]);

    if (!expertExists || !clientExists || !documentExists) {
      return res.status(404).json({ message: "Expert, client ou document introuvable" });
    }

    // Récupérer les chemins des images téléchargées
    const imagePaths = req.files.map(file => file.path);

    // Création de l'objet ImageSinistres avec la liste d'images et imageAfterAccident vide
    const newImageSinistre = new ImageSinistres({
      image: imagePaths, // Liste des chemins des images
      imageAfterAccident: [], // ✅ Défini par défaut comme liste vide
      expert: expertId,
      client: clientId,
      documents: documentId
    });

    await newImageSinistre.save();
    res.status(201).json({ message: "Images ajoutées avec succès", newImageSinistre });

  } catch (error) {
    console.error("Erreur lors de l'ajout des images :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const getImagesByExpert = async (req, res) => {
  try {
    const expertId = req.params.expertId;

    // Vérifier si l'expert existe
    const expertExists = await Experts.findById(expertId);
    if (!expertExists) {
      return res.status(404).json({ message: "Expert introuvable" });
    }

    const images = await ImageSinistres.find({ expert: expertId })
      .populate('client', 'nom prenom email')  // Récupérer les infos du client
      .populate('documents', 'description doc'); // Récupérer les infos du document

    // Afficher les données récupérées dans la console
    console.log("Données des images récupérées:", images);

    res.status(200).json(images);
  } catch (error) {
    console.error("Erreur getImagesByExpert:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des images", error: error.message });
  }
};





export const getDevisByExpert = async (req, res) => {
  try {
    const expertId = req.params.expertId;

    // Vérifier si l'expert existe
    const expertExists = await Experts.findById(expertId);
    if (!expertExists) {
      return res.status(404).json({ message: "Expert introuvable" });
    }

    const devis = await DevisSinistres.find({ expert: expertId })
      .populate('client', 'nom prenom email')  // Récupérer les infos du client
      .populate('documents', 'description doc') // Récupérer les infos du document
      .select('_id expert client documents devis dateAjout'); // Explicitement sélectionner tous les champs

    res.status(200).json(devis);
  } catch (error) {
    console.error("Erreur getDevisByExpert:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des devis", error: error.message });  }
};



export const deleteImageSinistre = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const image = await ImageSinistres.findByIdAndDelete(imageId);
    
    if (!image) {
      return res.status(404).json({ message: "Image non trouvée" });
    }

    res.status(200).json({ message: "Image supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'image", error });
  }
};


export async function countExperts (req, res){
  try {
    const expertsCount = await Experts.countDocuments({});

    res.json({ expertsCount });
  } catch (error) {
    console.error('Error counting experts:', error);
    res.status(500).json({ message: 'Error counting experts' });
  }
};

export const ajouterImageAfterAccident = async (req, res) => {
  try {
    const { sinistreId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Veuillez télécharger au moins une image" });
    }

    const sinistre = await ImageSinistres.findById(sinistreId);
    if (!sinistre) {
      return res.status(404).json({ message: "Sinistre non trouvé" });
    }

    // Ajouter les chemins des fichiers à imageAfterAccident
    req.files.forEach(file => {
      sinistre.imageAfterAccident.push(file.path);
    });

    await sinistre.save();
    res.status(200).json({ message: "Images ajoutées avec succès", sinistre });

  } catch (error) {
    console.error("Erreur lors de l'ajout de l'image :", error);
    res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
  }
};

export {  signin, putPassword};