import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary'; 

import Clients from '../models/Client.js'; // Import des discriminators
import PersonneMorale  from '../models/PersonneMorale.js'; // Importez le modèle PersonneMorale
import PersonnePhysique from '../models/PersonnePhysique.js'; // Importez le modèle PersonnePhysique
import Experts from '../models/Expert.js';
import Documents from '../models/Document.js';
import DevisSinistres from '../models/devisSinistre.js';
import ImageSinistres from '../models/imageSinistre.js';

import { validationResult } from 'express-validator';
import Employees from '../models/Employees.js';
import { sendEmail, sendSMS } from './utils/mailing.js';

const jwtsecret = "mysecret";

const generateHashedPassword = async (motdepasse) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(motdepasse, saltRounds);
  return hashedPassword;
};



const signup = async (req, res) => {
  const {
    email, password, confirmPassword, phoneNumber, adresse,
    typeClient, // Type de client (PersonnePhysique ou PersonneMorale)
    nom, prenom, birthDate, numeroPermis, identifiant_national, CIN_Pass, sex, nationalite, profession, // Champs pour PersonnePhysique
    raisonSociale, activite, matricule_fiscal // Champs pour PersonneMorale
  } = req.body;

  try {
    // Vérification si l'utilisateur existe déjà
    const existingUser = await Clients.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Vérification de l'image de profil
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Vérification de la confirmation du mot de passe
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 8);

    let newClient;
    if (typeClient === 'PersonnePhysique') {
      // Validation des champs obligatoires pour PersonnePhysique
      if (!nom || !prenom || !birthDate || !numeroPermis || !identifiant_national || !CIN_Pass || !sex || !nationalite || !profession) {
        return res.status(400).json({ message: 'Missing required fields for PersonnePhysique' });
      }

      // Création de l'objet PersonnePhysique
      newClient = new PersonnePhysique({
        nom,
        prenom,
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword, // Vous pouvez décider de ne pas stocker la confirmation du mot de passe
        image: imageFile.path,
        phoneNumber,
        adresse,
        typeClient,
        birthDate,
        numeroPermis,
        identifiant_national,
        CIN_Pass,
        sex,
        nationalite,
        profession,
      });
    } else if (typeClient === 'PersonneMorale') {
      // Validation des champs obligatoires pour PersonneMorale
      if (!raisonSociale || !activite || !matricule_fiscal) {
        return res.status(400).json({ message: 'Missing required fields for PersonneMorale' });
      }

      // Création de l'objet PersonneMorale
      newClient = new PersonneMorale({
        raisonSociale,
        email,
        password: hashedPassword,
        image: imageFile.path,
        phoneNumber,
        adresse,
        typeClient,
        activite,
        matricule_fiscal,
      });
    } else {
      return res.status(400).json({ message: 'Invalid typeClient' });
    }

    // Sauvegarde du client dans la base de données
    await newClient.save();

    res.status(201).json({ message: 'User registered successfully', client: newClient });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};




// const signin = async (req, res) => {
//   const { email, password } = req.body;
  
//   try {
//     // Vérifiez si la clé secrète JWT est définie
//     if (!process.env.jwt_Secret) {
//       return res.status(500).json({ message: 'JWT secret key is missing' });
//     }

//     // Essayer de trouver l'utilisateur en tant que client d'abord
//     let user = await Clients.findOne({ email });
//     let isExpert = false;
    
//     // Si aucun client n'est trouvé, essayer de trouver en tant qu'expert
//     if (!user) {
//       user = await Experts.findOne({ email });
//       isExpert = true;
      
//       // Si l'utilisateur n'existe ni comme client ni comme expert
//       if (!user) {
//         return res.status(404).send({ message: 'Utilisateur non trouvé.' });
//       }
//     }

//     // Vérifiez si le mot de passe est valide
//     const passwordIsValid = bcrypt.compareSync(password, user.password);
    
//     if (!passwordIsValid) {
//       return res.status(401).send({ message: 'Mot de passe invalide!' });
//     }

//     // Génération d'un jeton JWT avec l'information client/expert incluse
//     const token = jwt.sign(
//       { 
//         id: user._id,
//         isExpert: isExpert 
//       }, 
//       process.env.jwt_Secret, 
//       {
//         expiresIn: 31557600, // 1 an
//       }
//     );

//     // Stockez le jeton dans la session
//     req.session.token = token;

//     // Préparation de la réponse avec les champs communs
//     const response = {
//       _id: user._id,
//       email: user.email,
//       token: token,
//       isExpert: isExpert,
//       userType: user.typeClient
//     };

//     // Ajouter des champs spécifiques en fonction du type d'utilisateur
//     if (!isExpert) {
//       // Champs spécifiques aux clients
//       response.typeClient = user.typeClient || "PersonnePhysique"; // Type de client par défaut
//       response.adresse = user.adresse || null;
//       response.phoneNumber = user.phoneNumber || null;
//       response.image = user.image || null;
//     } else {
//       // Champs spécifiques aux experts
//       response.nom = user.nom || null;
//       response.prenom = user.prenom || null;
//       response.region = user.region || null;
//       response.taux = user.taux || null;
//       response.phoneNumber = user.phoneNumber || null;
//       response.image = user.image || null;
//     }

//     // Réponse avec les détails de l'utilisateur et le jeton
//     res.status(200).json(response);
    
//   } catch (error) {
//     console.error('Error during sign in:', error);
//     res.status(500).json({ message: 'Erreur lors de la connexion' });
//   }
// };


const signin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Vérifiez si la clé secrète JWT est définie
    if (!process.env.jwt_Secret) {
      return res.status(500).json({ message: 'JWT secret key is missing' });
    }

    // Variables pour stocker le type d'utilisateur
    let user = null;
    let isExpert = false;
    let isEmployee = false;
    
    // Essayer de trouver l'utilisateur en tant que client d'abord
    user = await Clients.findOne({ email });
    
    // Si aucun client n'est trouvé, essayer de trouver en tant qu'expert
    if (!user) {
      user = await Experts.findOne({ email });
      if (user) {
        isExpert = true;
      } else {
        // Si aucun expert n'est trouvé, essayer de trouver en tant qu'employé
        user = await Employees.findOne({ email });
        if (user) {
          isEmployee = true;
        } else {
          // Si l'utilisateur n'existe dans aucune catégorie
          return res.status(404).send({ message: 'Utilisateur non trouvé.' });
        }
      }
    }

    // Vérifiez si le mot de passe est valide
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Mot de passe invalide!' });
    }

    // Génération d'un jeton JWT avec l'information utilisateur incluse
    const token = jwt.sign(
      { 
        id: user._id,
        isExpert: isExpert,
        isEmployee: isEmployee
      }, 
      process.env.jwt_Secret, 
      {
        expiresIn: 31557600, // 1 an
      }
    );

    // Stockez le jeton dans la session
    req.session.token = token;

    // Préparation de la réponse avec les champs communs
    const response = {
      _id: user._id,
      email: user.email,
      token: token,
      isExpert: isExpert,
      isEmployee: isEmployee
    };

    // Champs supplémentaires selon le type d'utilisateur
    if (!isExpert && !isEmployee) {
      // Client
      response.typeClient = user.typeClient || "PersonnePhysique";
      response.adresse = user.adresse || null;
      response.phoneNumber = user.phoneNumber || null;
      response.image = user.image || null;
    } else if (isExpert) {
      // Expert
      response.nom = user.nom || null;
      response.prenom = user.prenom || null;
      response.region = user.region || null;
      response.taux = user.taux || null;
      response.phoneNumber = user.phoneNumber || null;
      response.image = user.image || null;
    } else if (isEmployee) {
      // Employé
      response.nom = user.nom || null;
      response.prenom = user.prenom || null;
      response.department = user.department || null;
      response.poste = user.poste || null;
      response.phoneNumber = user.phoneNumber || null;
      response.image = user.image || null;
    }

    // Réponse avec les détails de l'utilisateur et le jeton
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};


export function getClientById(req, res) {
  const userId = req.params.id;

  Clients.findById(userId)
    .then((doc) => {
      if (!doc) {
        // Gérer le cas où l'utilisateur n'est pas trouvé
        return res.status(404).json({ message: 'Clients non trouvé' });
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




export async function updateClientProfile(req, res) {
  try {
    // Extraire les champs du corps de la requête
    const { email, phoneNumber, adresse, ...specificData } = req.body;

    // Préparer l'objet avec uniquement les champs de base
    let updateData = {};
    
    // N'ajouter que les champs qui sont présents dans la requête
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (adresse) updateData.adresse = adresse;

    // Ajouter l'image uniquement si un nouveau fichier est envoyé
    if (req.file) {
      console.log('File received:', req.file);
      updateData.image = req.file.path;
    }

    // Ajouter les données spécifiques au type de client
    Object.keys(specificData).forEach(key => {
      if (specificData[key]) {
        updateData[key] = specificData[key];
      }
    });

    // Récupérer le type de client actuel de la base de données
    const existingClient = await Clients.findById(req.params.id);
    if (!existingClient) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const typeClient = existingClient.typeClient;

    // Mettre à jour le client en fonction de son type
    let updatedClient;
    if (typeClient === 'PersonnePhysique') {
      updatedClient = await PersonnePhysique.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );
    } else if (typeClient === 'PersonneMorale') {
      updatedClient = await PersonneMorale.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );
    } else {
      return res.status(400).json({ message: 'Type de client non valide' });
    }

    if (updatedClient) {
      res.status(200).json(updatedClient);
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

    const user = await Clients.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    Clients.password = hashPassword;
    Clients.resetPasswordToken = undefined;
    Clients.resetPasswordExpires = undefined;

    await Clients.save();

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
  Clients.find({})
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
  try {
    const { id, userModel } = req.params; // userModel spécifie le modèle utilisateur (Client, Expert, Employee)

    if (!id) {
      return res.status(400).json({ message: 'L\'ID de l\'utilisateur est requis.' });
    }

    if (!userModel) {
      return res.status(400).json({ message: 'Le modèle utilisateur est requis.' });
    }

    // Déterminer le modèle approprié en fonction de userModel
    let Model;
    switch (userModel) {

      case 'Expert':
        Model = require('../models/Expert.js'); // Chemin vers votre modèle Expert
        break;
      case 'Employee':
        Model = require('../models/Employees.js'); // Chemin vers votre modèle Employee
        break;
      default:
        return res.status(400).json({ message: "Modèle utilisateur invalide." });
    }

    // Rechercher et supprimer l'utilisateur dans le modèle approprié
    const user = await Model.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur.' });
  }
}



export const countClientsByType = async (req, res) => {
  try {
    console.log('Counting users by type...');
    const PPCount = await Clients.countDocuments({ typeClient: 'PersonnePhysique' });
    const PMCount = await Clients.countDocuments({ typeClient: 'PersonneMorale' });
    res.json({ PPCount, PMCount });
  } catch (error) {
    console.error('Error counting users:', error);
    res.status(500).json({ message: 'Error counting users' });
  }
};


// export const addDevisSinistre = async (req, res) => { 
//   try {
//     const { expertId, clientId, documentId } = req.body;

//     // Vérification des données requises
//     if (!expertId || !clientId || !documentId) {
//       return res.status(400).json({ message: "Données manquantes (expertId, clientId ou documentId)" });
//     }

//     // Vérifier si des fichiers ont été envoyés
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "Veuillez télécharger au moins un fichier PDF" });
//     }

//     // Récupérer les noms des fichiers PDF uploadés
//     const pdfNames = req.files.map(file => file.filename);

//     // Vérifier si les entités existent
//     const [expertExists, clientExists, documentExists] = await Promise.all([
//       Experts.findById(expertId),
//       Clients.findById(clientId),
//       Documents.findById(documentId)
//     ]);

//     if (!expertExists || !clientExists || !documentExists) {
//       return res.status(404).json({ message: "Expert, client ou document introuvable" });
//     }

//     // Création de l'objet DevisSinistres avec la liste des PDFs
//     const newDevisSinistre = new DevisSinistres({
//       devis: pdfNames, // Liste des fichiers PDF
//       expert: expertId,
//       client: clientId,
//       documents: documentId
//     });

//     await newDevisSinistre.save();
//     res.status(201).json({ message: "PDFs ajoutés avec succès", newDevisSinistre });

//   } catch (error) {
//     console.error("Erreur lors de l'ajout des PDFs :", error);
//     res.status(500).json({ message: "Erreur serveur", error: error.message });
//   }
// };

export const addDevisSinistre = async (req, res) => { 
  try {
    const { expertId, clientId, documentId } = req.body;

    // Vérification des données requises
    if (!expertId || !clientId || !documentId) {
      return res.status(400).json({ message: "Données manquantes (expertId, clientId ou documentId)" });
    }

    // Vérifier si des fichiers ont été envoyés
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Veuillez télécharger au moins un fichier PDF" });
    }

    // Récupérer les noms des fichiers PDF uploadés
    const pdfNames = req.files.map(file => file.filename);

    // Vérifier si les entités existent
    const [expertExists, clientExists, documentExists] = await Promise.all([
      Experts.findById(expertId),
      Clients.findById(clientId),
      Documents.findById(documentId)
    ]);

    if (!expertExists || !clientExists || !documentExists) {
      return res.status(404).json({ message: "Expert, client ou document introuvable" });
    }

    // Création de l'objet DevisSinistres avec la liste des PDFs
    const newDevisSinistre = new DevisSinistres({
      devis: pdfNames, // Liste des fichiers PDF
      expert: expertId,
      client: clientId,
      documents: documentId
    });

    await newDevisSinistre.save();

    // Préparation du message pour l'expert
    const expertMessage = `Bonjour ${expertExists.nom},\n\nLe client ${clientExists.nom} vous a envoyé des devis..`;

    // Gestion des notifications par promesses concurrentes
    const notificationPromises = [];

    // Ajout des envois d'emails aux promesses
    notificationPromises.push(
      sendEmail(
        expertExists.email,
        'Envoi de devis',
        `${expertMessage}\n\nVeuillez consulter votre espace pour plus d'informations.\n\nCordialement,\nL'équipe.`
      )
    );

    try {
      notificationPromises.push(
      sendSMS(expertExists.phoneNumber, expertMessage)
    );
  } catch (smsError) {
    console.error("Erreur lors de l'envoi des SMS:", smsError);
    // On continue l'exécution même si les SMS échouent
  }
    // Attendre toutes les notifications (emails + SMS)
    await Promise.allSettled(notificationPromises);

    res.status(201).json({ message: "PDFs ajoutés avec succès", newDevisSinistre });

  } catch (error) {
    console.error("Erreur lors de l'ajout des PDFs :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


export const getDevisByClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // Vérifier si le client existe
    const clientExists = await Clients.findById(clientId);
    if (!clientExists) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    const images = await DevisSinistres.find({ client: clientId })
      .populate('expert', 'nom prenom email')  // Récupérer les infos de l'expert
      .populate('documents', 'description doc'); // Récupérer les infos du document

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des images", error });
  }
};




export const getImagesByClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // Vérifier si le client existe
    const clientExists = await Clients.findById(clientId);
    if (!clientExists) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    const images = await ImageSinistres.find({ client: clientId })
      .populate('expert', 'nom prenom email')  // Récupérer les infos de l'expert
      .populate('documents', 'description doc'); // Récupérer les infos du document

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des images", error });
  }
};

export { signup, signin, putPassword};