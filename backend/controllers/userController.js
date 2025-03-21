import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";








const forgotPassword = async (req, res) => {
  try {
    const { email, userModel } = req.body; // userModel spécifie le modèle utilisateur (Client, Expert, Employee)

    if (!email) {
      return res.status(400).json({ message: "L'email est requis." });
    }
    if (!userModel) {
      return res.status(400).json({ message: "Le modèle utilisateur est requis." });
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

    // Rechercher l'utilisateur dans le modèle approprié
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Générer un token de réinitialisation temporaire
    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Expiration dans 1 heure
    await user.save();

    const resetPasswordLink = `http://localhost:4200/resetPassword/${user._id}`;

    // Configuration de Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'comar2866@gmail.com',
        pass: 'xnnp ifoj fujq skyt',
      },
    });

    const mailOptions = {
      from: 'comar2866@gmail.com',
      to: adresse,
      subject: 'Réinitialisation de mot de passe',
      html: `
      <p>Bonjour,</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :</p>
      <a href="${resetPasswordLink}">${resetPasswordLink}</a>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
    `,
    };

    // Envoi de l'email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Erreur lors de l'envoi de l'e-mail." });
      }
      console.log('Email envoyé : ' + info.response);
      res.json({ message: 'E-mail de réinitialisation envoyé avec succès.' });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe." });
  }
};




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


};
