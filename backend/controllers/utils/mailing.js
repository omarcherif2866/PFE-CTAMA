// mailing.js
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendEmail(to, subject, text) {
  try {
    // Configuration de Nodemailer avec variables d'environnement
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Préparation et envoi de l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email envoyé avec succès: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error; // Propagation de l'erreur pour la gestion dans la fonction appelante
  }
}

export async function sendSMS(phoneNumber, message) {
  try {
    // Création du client Twilio avec les variables d'environnement
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Formatage du numéro de téléphone au format E.164
    const formattedPhoneNumber = `+216${phoneNumber}`;

    // Envoi du SMS
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhoneNumber
    });

    console.log(`SMS envoyé avec succès, SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS:", error);
    throw error; // Propagation de l'erreur pour la gestion dans la fonction appelante
  }
}
