import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Client from '../models/Client.js';
import Expert from '../models/Expert.js';
import Employee from '../models/Employees.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Documents from '../models/Document.js';

import path from 'path'; // Manquant dans ton extrait
import fs from 'fs';

const statsPath = path.join(process.cwd(), 'public', 'fourniture_stats.json');


const verificationCodes = new Map();

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "L'email est requis." });
    }

    let user = await Client.findOne({ email }) || 
               await Expert.findOne({ email }) || 
               await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Générer un code de vérification sécurisé
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Stocker le code temporairement en mémoire avec un délai d'expiration
    verificationCodes.set(user._id.toString(), {
      code: verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Envoi du mail avec le code
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Votre code de vérification',
      html: `
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Votre code de vérification est : <strong>${verificationCode}</strong></p>
        <p>Ce code est valide pendant 10 minutes.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>`
    };

    await transporter.sendMail(mailOptions);

    // Renvoyer l'ID utilisateur pour le front-end
    res.json({ 
      message: 'Code de vérification envoyé avec succès.',
      userId: user._id.toString() 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne." });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ message: "ID utilisateur et code requis." });
    }

    // Récupérer le code de vérification stocké en mémoire
    const storedCode = verificationCodes.get(userId);

    if (!storedCode || storedCode.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Code expiré ou invalide." });
    }

    if (storedCode.code !== code) {
      return res.status(400).json({ message: "Code incorrect." });
    }

    // Supprimer le code après vérification
    verificationCodes.delete(userId);

    res.json({ message: "Code vérifié avec succès." });

  } catch (error) {
    console.error("Erreur lors de la vérification :", error);
    res.status(500).json({ message: "Erreur lors de la vérification du code." });
  }
};


// Count how many documents are assigned per expert
export async function getOrdreMissionStats(req, res) {
  try {
    const stats = await Documents.aggregate([
      { $match: { expert: { $ne: null } } }, // uniquement les constats avec expert affecté
      {
        $group: {
          _id: '$expert',
          total: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'experts',
          localField: '_id',
          foreignField: '_id',
          as: 'expertDetails'
        }
      },
      {
        $unwind: '$expertDetails'
      },
      {
        $project: {
          _id: 0,
          expert: '$expertDetails.nom',
          total: 1
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error("Erreur stats ordre de mission:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export async function getExpertsGroupedByRegion(req, res) {
  try {
    const experts = await Expert.aggregate([
      {
        $group: {
          _id: '$region',
          experts: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Trier par région (ordre alphabétique)
      }
    ]);

    res.status(200).json(experts);
  } catch (err) {
    console.error("Erreur lors de la récupération des experts par région :", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}


export async function compterFournitures(req, res) {
  try {
    const statsPath = path.join(process.cwd(), 'public', 'fourniture_stats.json');
    
    if (!fs.existsSync(statsPath)) {
      return res.status(200).json({});
    }
    
    const content = fs.readFileSync(statsPath, 'utf-8');
    const compteur = JSON.parse(content);
    
    // Retourner directement le compteur
    res.status(200).json(compteur);
  } catch (error) {
    console.error("Erreur lors du comptage:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}










const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, userModel } = req.body; // userModel spécifie le modèle utilisateur (Client, Expert, Employee)

    if (!resetToken) {
      return res.status(400).json({ message: 'Le token de réinitialisation est requis.' });
    }
    if (!newPassword) {
      return res.status(400).json({ message: 'Le nouveau mot de passe est requis.' });
    }
    if (!userModel) {
      return res.status(400).json({ message: 'Le modèle utilisateur est requis.' });
    }

    // Déterminer le modèle approprié en fonction de userModel
    let Model;
    switch (userModel) {
      case 'Client':
        Model = require('../models/Client.js'); // Chemin vers votre modèle Client
        break;
      case 'Expert':
        Model = require('../models/Expert.js'); // Chemin vers votre modèle Expert
        break;
      case 'Employee':
        Model = require('../models/Employees.js'); // Chemin vers votre modèle Employee
        break;
      default:
        return res.status(400).json({ message: "Modèle utilisateur invalide." });
    }

    // Rechercher l'utilisateur dans le modèle approprié avec le token de réinitialisation
    const user = await Model.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token de réinitialisation invalide ou expiré.' });
    }

    console.log("Utilisateur trouvé =>", user.nom);
    console.log("Nouveau mot de passe =>", newPassword);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = bcrypt.hashSync(newPassword, 8);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Réinitialisation du mot de passe réussie.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
};






function generateResetToken() {
  const resetToken = jwt.sign({ data: 'resetToken' }, 'projetPI-secret-key', { expiresIn: '1h' });
  return resetToken;
};




export {

  forgotPassword,
  resetPassword,
  verifyCode

};
