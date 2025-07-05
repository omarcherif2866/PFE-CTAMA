import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();  // Charger les variables d'environnement

const validateContactData = [
    body('email').isEmail().withMessage('Adresse email invalide'),
    body('subject').notEmpty().withMessage('Le sujet est requis'),
    body('message').notEmpty().withMessage('Le message est requis')
];

const sendContactEmail = async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        // Vérifier les erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Vérifier si les champs sont présents
        if (!email || !subject || !message) {
            return res.status(400).json({ message: 'Email, sujet et message sont requis' });
        }

        //  Créer le transporteur avec les informations SMTP de ton fournisseur
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD 
            },
        });

        //  Configuration de l'email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Toujours ton compte SMTP
            to: 'comar2866@gmail.com', // Le destinataire
            replyTo: email, // <-- Très important
            subject: subject,
            html: `Email envoyé par : ${email}<br><p>${message}</p>`,
        };


        // Envoi de l'email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé: ' + info.response);
        res.json({ message: 'Email de contact envoyé avec succès.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email de contact' });
    }
};




export { sendContactEmail, validateContactData };
