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

    const resetPasswordLink = `http://localhost:4200/resetPassword/${user._id}`;

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
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>
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

export async function getDocumentsGroupedByGouvernorat(req, res) {
  try {
    const documents = await Documents.aggregate([
      {
        $group: {
          _id: '$gouvernorat',
          experts: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Trier par région (ordre alphabétique)
      }
    ]);

    res.status(200).json(documents);
  } catch (err) {
    console.error("Erreur lors de la récupération des documents par région :", err);
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
    const password = req.body.password;
    const userId = req.params.id;

    if (!userId || !password) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    console.log('Recherche utilisateur avec ID =', userId);

    const models = [Client, Expert, Employee];
    let user = null;

    for (const Model of models) {
      user = await Model.findById(userId);
      if (user) break;
    }

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    user.password = bcrypt.hashSync(password, 8);
    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
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
