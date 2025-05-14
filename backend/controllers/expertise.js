
import Documents from '../models/Document.js';
import RDV from '../models/RDV.js';  // Importation du modèle RDV

import Experts from '../models/Expert.js'; 
import Expertises from '../models/Expertise.js'; 
import ImageSinistres from '../models/imageSinistre.js';
import DevisSinistres from '../models/devisSinistre.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfExtract   from "pdf.js-extract";
import mongoose from 'mongoose';
import { sendEmailWithAttachment, sendSMS } from './utils/mailing.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import numberToWords from 'n2words';
import axios from 'axios';  






export async function generatePDF(documentId) {
    // Récupérer le document avec les informations de l'expert
    const document = await Documents.findById(documentId).populate('expert').populate('client');
    if (!document) {
        throw new Error('Document not found');
    }

    const expert = document.expert;
    if (!expert) {
        throw new Error('Expert not found for this document');
    }

    // Vérifier si le client existe
    const client = document.client;
    if (!client) {
        throw new Error('Client not found for this document');
    }

    // Déterminer le nom du client en fonction de son type
    let clientNom = "Client inconnu";
    if (client.typeClient === "PersonnePhysique") {
        const personnePhysique = await mongoose.model("PersonnePhysique").findById(client._id);
        if (personnePhysique) {
            clientNom = personnePhysique.nom;
        }
    } else if (client.typeClient === "PersonneMorale") {
        const personneMorale = await mongoose.model("PersonneMorale").findById(client._id);
        if (personneMorale) {
            clientNom = personneMorale.matricule_fiscal;
        }
    }

    // Récupérer le dernier RDV
    const rdv = await RDV.findOne({ ownedBy: document.expert._id }).sort({ date: -1, heure: -1 });
    
    // Obtenir directement les données extraites en appelant l'API d'extraction
    // Ceci est l'approche la plus directe
    let extractedData = {};
    try {
        // Appeler directement la fonction d'extraction du texte
        const pdfPath = path.join(process.cwd(), 'public', 'pdfs', document.doc);
        
        if (fs.existsSync(pdfPath)) {
            const pdfExtractInstance = new pdfExtract.PDFExtract();
            const options = {};
            
            const data = await new Promise((resolve, reject) => {
                pdfExtractInstance.extract(pdfPath, options, (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                });
            });
            
            let extractedText = '';
            data.pages.forEach(page => {
                page.content.forEach(item => {
                    extractedText += item.str + ' ';
                });
                extractedText += '\n\n';
            });
            
            // Utiliser la fonction parseExtractedText directement
            extractedData = parseExtractedText(extractedText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'extraction des données:', error);
        // Continuer avec un objet vide si l'extraction échoue
    }
    
    const doc = new PDFDocument();
    const name = `./generated/pdf/Ordre de mission-${document.reference || 'sans-ref'}.pdf`;
    
    const outputStream = fs.createWriteStream(name);
    doc.pipe(outputStream);
    
    // Charger la police arabe
    const arabicFontPath = 'arabic_font/NotoSansArabic-Regular.ttf'; // Remplacez par le chemin vers votre police
    doc.font(arabicFontPath); // Appliquez la police arabe
    
    // Définir les dimensions et la position des éléments
    const tableStartY = 160;  // L'espace entre le titre et le tableau
    const tableHeight = 150;
    
    // Position des titres
    let mainTitleY = 20;  // Position du titre en arabe
    let subTitleY = mainTitleY + 40;  // Espacement entre le titre arabe et le titre français
    const logoPath = 'assets/ctama.png'; // Remplace avec le chemin réel de ton logo
    const logoWidth = 100;  // Ajuste la largeur du logo
    const logoHeight = 70;  // Ajuste la hauteur du logo

    // Insérer le logo centré
    const logoX = doc.page.width - logoWidth - 20; // 30 = marge droite

    // Insérer le logo à droite, même Y que les titres
    doc.image(logoPath, logoX, subTitleY, { width: logoWidth, height: logoHeight });

    // Titre en arabe (avec une taille de police plus grande et centrée)
    doc.fontSize(18)
       .text('الفلاحي التعاوني للتأمين التونسي  الصندوق ', {
           align: 'center',
           width: doc.page.width - 150,  // Largeur de la page moins 40 pour l'espacement
           lineBreak: false
       });
    
    // Titre en français (plus petit et centré également)
    doc.fontSize(12)
       .font('Helvetica-Bold') // Garder Helvetica pour le texte en français
       .text('CAISSE TUNISIENNE D\'ASSURANCES MUTUELLES AGRICOLES', {
           align: 'center',
           width: doc.page.width - 150,  // Largeur de la page moins 40 pour l'espacement
           lineBreak: false
       });
    

    doc.fontSize(18)
    .font('Helvetica-Bold') // Garder Helvetica pour le texte en français
    .text(' ORDRE DE MISSION D\'EXPERTISE', {
        align: 'center',
        width: doc.page.width - 150,  // Largeur de la page moins 40 pour l'espacement
        lineBreak: false
    });


    const textStartX = 30;
    let textY = tableStartY + 10;
    const padding = 10;
    
    // Données à afficher
    const infos = [
        { label: 'Expert : ', value: `${document.expert.nom} ${document.expert.prenom}` },
        { label: 'Email : ', value: `${document.expert.email}` },
        { label: 'Téléphone : ', value: `${document.expert.phoneNumber}` }
      ];
    
    // Calculer la largeur maximale du texte
    doc.fontSize(12).font('Helvetica');
    const lineWidths = infos.map(info => 
        doc.widthOfString(info.label) + doc.font('Helvetica-Bold').widthOfString(info.value)
      );
    const maxLineWidth = Math.max(...lineWidths);
    
    // Calculer hauteur totale
    const totalHeight = infos.length * 20 + padding * 2;
    
    // Dessiner fond gris proportionnel au contenu
    doc.save()
       .rect(textStartX - padding, textY - padding, maxLineWidth + padding * 2, totalHeight)
       .fill('#d2d2d2') // gris clair
       .restore(); // pour ne pas appliquer le fond aux textes suivants
    
    // Ajouter le texte par-dessus le fond
    doc.fillColor('black').font('Helvetica');
    for (const info of infos) {
        doc.font('Helvetica').text(info.label, textStartX, textY, { continued: true });
        doc.font('Helvetica-Bold').text(info.value);
        textY += 20;
      }
    

//     // Ajouter la ligne en gras sous le tableau (hors tableau)
    const belowTableY = tableStartY + tableHeight + 8;

    const accidentDate = extractedData.date || '';
    const accidentHeure = extractedData.time || '';

    const belowExpert = textY - 60 + totalHeight;

    doc.fontSize(12)
       .font('Helvetica').text('Monsieur, Nous avons l\'honneur de vous confier la mission d\'expertise du véhicule de notre assuré : ', 30, belowExpert, { continued: true })

       // Position de départ du fond et du texte
    const contentStartY = belowTableY ;
    const startX = 30;
    const rowHeight = 20;
    const data = extractedData.parties[0]; // ✅ seulement la première partie

    let rows = [
    { label: 'NOM ET PRENOM : » ', value: `${data.assure.nom || ''} ${data.assure.prenom || ''}` },
    { label: 'TEL : » ', value: data.assure.telephone || '' },
    { label: 'DATE DE L\'ACCIDENT : » ', value: accidentDate || '' },
    { label: 'LIEU DE L\'ACCIDENT : » ', value: accidentHeure || '' },
    { label: 'STE D\'ASSURANCE DU TIERS : » ', value: extractedData.parties[1]?.societe_assurance || '' },
    { label: 'Marque : » ', value: data.vehicule.marque_type || '' },
    { label: 'N° d\'immatriculation du véhicule : » ', value: data.vehicule.immatriculation || '' },

    ];

    // Hauteur totale du fond
    const bgHeight = rows.length * rowHeight + padding * 2;

    // Fond gris clair
    doc.save()
    .rect(20, contentStartY - padding, doc.page.width - 40, bgHeight)
    .fill('#d2d2d2') // gris clair
    .restore();

    // Titre
    doc.fontSize(14).font('Helvetica-Bold')
    .text('', {
        underline: true
    });

    // Impression des lignes dans une seule colonne
    let currentY = contentStartY;

    rows.forEach(row => {
    doc.font('Helvetica').fontSize(12).text(row.label, startX, currentY, { continued: true });
    doc.font('Helvetica-Bold').text(row.value);
    currentY += rowHeight;
    });


    const belowAss = contentStartY +160 ;       

    doc.fontSize(12)
    .font('Helvetica').text('A cet effet, nous vous précisons, outre les informations indiquées sur le constat amiable ou la déclaration dont deux copies ci jointes sur les renseignements relatifs à l\'assuré et à son véhicule suivants ', 30, belowAss, { continued: true })

    doc.moveDown(2); // Ajuste le nombre selon l'espace désiré (chaque moveDown ≈ une ligne)
    const belowphrase = doc.y;
    
 
    doc.fontSize(10)
    .font('Helvetica-Bold') // Garder Helvetica pour le texte en français
    .text('NATURE DES GARANTIES', {
        align: 'center',
        width: doc.page.width - 150,  // Largeur de la page moins 40 pour l'espacement
        lineBreak: false
    });
    

    doc.fontSize(12)
    .font('Helvetica').text('Enfin, nous vous prions de bien vouloir satisfaire aux obligations mises à la charge de l\'expert prévues par la convention Expertise AutomobileVeuillez agréer, Monsieur, L\'expression de notre considération distinguée', 30, belowAss+150, { continued: true })
  
// Police arabe
doc.font(arabicFontPath)
   .fontSize(12);

// Dessiner un carré (checkbox) pour la première phrase
const checkboxX = 30;
const checkboxY = belowAss + 100;  // Position de la première phrase
const checkboxSize = 10;

// Le carré pour la première phrase
doc.rect(checkboxX, checkboxY, checkboxSize, checkboxSize).stroke();

// Utilisation d'un caractère 'X' pour simuler un check
const checkSymbol = 'X'; // X comme check

// Afficher le 'X' centré dans le carré
doc.fontSize(10)
   .text(checkSymbol, checkboxX - 158, checkboxY - 4.9); // Centré à l'intérieur du carré

// Première phrase en arabe à côté du carré
doc.fontSize(12)
   .text('المدنية المسؤولية', checkboxX + checkboxSize + 10, checkboxY);  // Première phrase

// Décalage vertical pour la deuxième phrase
const secondCheckboxY = checkboxY + 20; // Décaler la deuxième phrase de 20px

// Dessiner un second carré (checkbox) pour la deuxième phrase
const secondCheckboxX = checkboxX;  // Position X identique pour le carré
doc.rect(secondCheckboxX, secondCheckboxY, checkboxSize, checkboxSize).stroke();  // Le carré pour la deuxième phrase

// Afficher le 'X' centré dans le carré de la deuxième phrase
doc.fontSize(10)
   .text(checkSymbol, secondCheckboxX + 2, secondCheckboxY - 4.9);  // Centré à l'intérieur du second carré

// Deuxième phrase en arabe à côté du deuxième carré
doc.fontSize(12)
   .text('الرجوع و الدفاع', secondCheckboxX + checkboxSize + 10, secondCheckboxY);  // Deuxième phrase


// Position du pied de page - déplacé un peu plus haut (ex : 60px au lieu de 20)
const footerY = doc.page.height - 95;

// Vérifier si nous sommes trop près du bas de la page
if (footerY + 25 > doc.page.height - 30) {
    doc.addPage(); // Ajouter une nouvelle page
    footerY = 30; // Réinitialiser la position Y en haut de la nouvelle page
}

// Première partie du texte français
doc.fontSize(7)
   .text('Siège Social:6, Av.Habib Thameur - 1069 Tunis - Tél : 71.340.933-Fax 71.322.276-', 40, footerY, {
       align: 'center',
       width: doc.page.width - 80,
       rtl: false
   });
   
// Deuxième partie du texte français
doc.text('Matricule Fiscal : 05855P/P/M/000 Registre de Commerce : B 110 199 1997 -E-mail : ctama@planet.tn', 40, footerY + 8, {
    align: 'center',
    width: doc.page.width - 80,
    rtl: false
});
   
    doc.end();

    const pdfPath = await new Promise((resolve, reject) => {
        outputStream.on('finish', () => {
            resolve(name);
        });
        outputStream.on('error', reject);
    });

    // Lire le fichier PDF généré
    const pdfAttachment = {
        filename: `Ordre_de_mission_${document.reference || 'sans-ref'}.pdf`,
        content: fs.readFileSync(pdfPath),
        contentType: 'application/pdf'
    };

    const expertMessage = `Bonjour ${expert.nom}, un ordre de mission a été généré pour le document ${document.doc} concernant le client ${clientNom}.`;
    const clientMessage = `Bonjour ${clientNom}, un ordre de mission a été généré pour votre dossier ${document.doc}.`;

    // Gestion des notifications par promesses concurrentes
    const notificationPromises = [];

    // Ajout des envois d'emails avec pièce jointe
    try {
        notificationPromises.push(
            sendEmailWithAttachment(
                expert.email,
                'Ordre de mission généré',
                `${expertMessage}\n\nVeuillez trouver ci-joint l'ordre de mission.\n\nCordialement,\nL'équipe.`,
                pdfAttachment
            )
        );

        notificationPromises.push(
            sendEmailWithAttachment(
                client.email,
                'Ordre de mission généré',
                `${clientMessage}\n\nVeuillez trouver ci-joint l'ordre de mission.\n\nCordialement,\nL'équipe.`,
                pdfAttachment
            )
        );
    } catch (emailError) {
        console.error("Erreur lors de l'envoi des emails:", emailError);
    }

    // Ajout des envois de SMS aux promesses (inchangé)
    try {
        notificationPromises.push(sendSMS(expert.phoneNumber, expertMessage));
        notificationPromises.push(sendSMS(client.phoneNumber, clientMessage));
    } catch (smsError) {
        console.error("Erreur lors de l'envoi des SMS:", smsError);
    }

    // Attendre toutes les notifications
    await Promise.allSettled(notificationPromises);

    // Retourner le chemin du fichier généré
    return pdfPath;
}



export async function extractTextFromPDF(req, res) {
    try {
        const { id } = req.params; // Récupérer l'ID du document à partir des paramètres de l'URL
        console.log('Recherche du document avec ID:', id);

        // Rechercher le document dans la base de données
        const document = await Documents.findById(id);
        if (!document) {
            console.log("Document non trouvé.");
            return res.status(404).json({
                message: "Document non trouvé ou fichier PDF manquant"
            });
        }

        // Vérifier si le champ doc existe
        if (!document.doc) {
            console.log("Le champ 'doc' est manquant pour ce document.");
            return res.status(404).json({
                message: "Document non trouvé ou fichier PDF manquant"
            });
        }

        console.log('Nom du fichier PDF:', document.doc);

        // Construire le chemin du fichier PDF à partir de la variable doc
        const pdfPath = path.join(process.cwd(), 'public', 'pdfs', document.doc);
        console.log('Chemin du fichier PDF:', pdfPath);

        if (!fs.existsSync(pdfPath)) {
            console.log("Fichier PDF introuvable à l'emplacement:", pdfPath);
            return res.status(404).json({
                message: "Fichier PDF introuvable",
                path: pdfPath
            });
        }

        // Créer une instance de PDFExtract
        const pdfExtractInstance = new pdfExtract.PDFExtract();
        const options = {}; // Options par défaut

        // Extraire le texte du fichier PDF
        const data = await new Promise((resolve, reject) => {
            pdfExtractInstance.extract(pdfPath, options, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        let extractedText = '';

        // Parcourir toutes les pages et extraire le texte
        data.pages.forEach(page => {
            page.content.forEach(item => {
                extractedText += item.str + ' ';
            });
            extractedText += '\n\n';
        });

        // Appeler la fonction parseExtractedText pour extraire les données spécifiques
        const extractedData = parseExtractedText(extractedText);

        // Retourner le texte extrait et les données structurées
        res.json({
            message: "Texte extrait avec succès",
            // text: extractedText,
            extractedData: extractedData // Données extraites selon vos critères
        });
    } catch (err) {
        console.error("Erreur lors du traitement:", err);
        res.status(500).json({
            message: "Erreur lors du traitement du PDF",
            error: err.message
        });
    }
}




function parseExtractedText(text) {
    console.log("Texte brut extrait du PDF :\n", text);

    // Extraire la date et l'heure
    const datePattern = /Date\s*(\d{4}-\d{2}-\d{2})/;
    const timePattern = /Heure\s*(\d{2}:\d{2})/;
    
    const date = text.match(datePattern) ? text.match(datePattern)[1] : null;
    const time = text.match(timePattern) ? text.match(timePattern)[1] : null;
    
    console.log(`Date ${date} Heure ${time}`);

    const parties = [];
    let currentParty = {};

    // Expressions régulières améliorées
    const regexPatterns = {
        societe_assurance: /Véhicule assuré par\s*:\s*(.+?)(?=\s+Contrat d'Assurance)/,
        contrat_assurance: /Contrat d'Assurance\s*:\s*(.+?)(?=\s+Agence Assurance)/,
        agence_assurance: /Agence Assurance\s*:\s*(.+?)(?=\s+Validité Assurance \(Début\))/,
        validite_assurance_debut: /Validité Assurance \(Début\)\s*:\s*([\d\-]+)/,
        validite_assurance_fin: /Validité Assurance \(Fin\)\s*:\s*([\d\-]+)/,
        identite_nom: /Identité\s*Nom\s*:\s*(.+?)(?=\s+Prénom)/,
        identite_prenom: /Prénom\s*:\s*(.+?)(?=\s+Adresse)/,
        identite_adresse: /Adresse\s*:\s*(.+?)(?=\s+Numéro Permis de Conduire)/,
        identite_numero_permis: /Numéro Permis de Conduire\s*:\s*(.+?)(?=\s+Délivré le)/,
        identite_delivre_le: /Délivré le\s*:\s*([\d\-]+)/,
        assure_nom: /Nom de l'Assuré\s*:\s*(.+?)(?=\s+Prénom de l'Assuré)/,
        assure_prenom: /Prénom de l'Assuré\s*:\s*(.+?)(?=\s+Adresse de l'Assuré)/,
        assure_adresse: /Adresse de l'Assuré\s*:\s*(.+?)(?=\s+Téléphone de l'Assuré)/,
        assure_telephone: /Téléphone de l'Assuré\s*:\s*([\d\s\+]+)/,
        vehicule_marque_type: /Marque et type du\s*:\s*(.+?)(?=\s+Immatriculation)/,
        vehicule_immatriculation: /Immatriculation\s*:\s*(.+?)(?=\s+Sens suivi)/,
        vehicule_venant_de: /Venant de\s*:\s*(.+?)(?=\s+Allant à)/,
        vehicule_allant_a: /Allant à\s*:\s*(.+)/,
        degats_apparents: /Dégats Apparents\s*:\s*(.+?)(?=\s+Observations|$)/g,
        observations: /Observations\s*:\s*(.+?)(?=\s+Dégats Apparents|$)/g,
    };

    // Fonction pour extraire les valeurs avec lookahead négatif
    const extractValue = (regex, text, isGlobal = false) => {
        if (isGlobal) {
            const matches = [];
            let match;
            const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
            const globalRegex = new RegExp(regex.source, flags);
            
            while ((match = globalRegex.exec(text)) !== null) {
                matches.push(match[1].trim());
                // Éviter les boucles infinies avec les regex globaux
                if (match.index === globalRegex.lastIndex) {
                    globalRegex.lastIndex++;
                }
            }
            return matches.length > 0 ? matches : [];
        } else {
            const match = text.match(regex);
            return match ? match[1].trim() : null;
        }
    };

    // Séparer les parties du conducteur A et B
    const partiesText = text.split(/(?=Société d'Assurances)/).filter(part => part.trim() !== '');

    partiesText.forEach((partyText, index) => {
        // Ne traiter que les parties qui contiennent "Véhicule assuré par"
        if (partyText.includes("Véhicule assuré par")) {
            currentParty = {
                societe_assurance: extractValue(regexPatterns.societe_assurance, partyText),
                contrat_assurance: extractValue(regexPatterns.contrat_assurance, partyText),
                agence_assurance: extractValue(regexPatterns.agence_assurance, partyText),
                validite_assurance_debut: extractValue(regexPatterns.validite_assurance_debut, partyText),
                validite_assurance_fin: extractValue(regexPatterns.validite_assurance_fin, partyText),
                identite: {
                    nom: extractValue(regexPatterns.identite_nom, partyText),
                    prenom: extractValue(regexPatterns.identite_prenom, partyText),
                    adresse: extractValue(regexPatterns.identite_adresse, partyText),
                    numero_permis: extractValue(regexPatterns.identite_numero_permis, partyText),
                    delivre_le: extractValue(regexPatterns.identite_delivre_le, partyText)
                },
                assure: {
                    nom: extractValue(regexPatterns.assure_nom, partyText),
                    prenom: extractValue(regexPatterns.assure_prenom, partyText),
                    adresse: extractValue(regexPatterns.assure_adresse, partyText),
                    telephone: extractValue(regexPatterns.assure_telephone, partyText)
                },
                vehicule: {
                    marque_type: extractValue(regexPatterns.vehicule_marque_type, partyText),
                    immatriculation: extractValue(regexPatterns.vehicule_immatriculation, partyText),
                    venant_de: extractValue(regexPatterns.vehicule_venant_de, partyText),
                    allant_a: extractValue(regexPatterns.vehicule_allant_a, partyText)
                },
                degats_apparents: extractValue(regexPatterns.degats_apparents, partyText, true),
                observations: extractValue(regexPatterns.observations, partyText, true)
            };

            parties.push(currentParty);
        }
    });

    // Supprimer la première partie si elle est vide (cas où le texte commence par "Société d'Assurances")
    if (parties.length > 2 && !parties[0].societe_assurance) {
        parties.shift();
    }

    // Ajouter la date et l'heure à l'objet résultat
    const result = { 
        message: "Texte extrait avec succès", 
        date: date,
        time: time,
        parties 
    };

    console.log("Données restructurées :", result);
    return result;
}

export async function generateRapportPDF(formData, res) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument();
  
        const filename = `rapport_expertise_${formData.assure}.pdf`;
        const outputPath = path.join(process.cwd(), 'public', 'pdfs', filename);
        const fileStream = fs.createWriteStream(outputPath);
  
        // Configuration des en-têtes HTTP pour le téléchargement
        setupResponseHeaders(res, filename);
  
        // Gestion des erreurs
        doc.on('error', (err) => {
          reject(err);
        });
  
        // ✅ Pipeline vers la réponse HTTP et vers un fichier local
        doc.pipe(fileStream);
        doc.pipe(res);
  
        // ➕ Ajout des sections
        const config = {
          margin: 20,
          doubleBoxX: 100,
          doubleBoxWidth: doc.page.width - 200,
        };
  
        addHeaderSection(doc, formData, config);
        addClientInfoTable(doc, formData, config);
        addVehicleSpecsTable(doc, formData, config);
        addDamageDescriptionSection(doc, formData, config);
        doc.addPage();
  
        const { endY: supplyY, totalTTC: fournitureTTC } = addSuppliesSection(doc, formData, config);
        const { endY: laborY, totalTTC: mainOeuvreTTC } = addLaborSection(doc, formData, config, supplyY);
        addFraisAnnexesSection(doc, formData, config);
  
        if (formData.images && Array.isArray(formData.images)) {
          addImagesToPDF(doc, formData.images, config);
        }
  
        addSignaturePage(doc);
        doc.end();
  
        // 🧠 Attendre que le fichier soit bien écrit
        fileStream.on('finish', async () => {
          await saveExpertise(formData, filename, fournitureTTC, mainOeuvreTTC);
          deleteImages(); // Nettoyage des images
          resolve();

// Nouvelle partie à remplacer dans expertise.js
const statsPath = path.join(process.cwd(), 'public', 'fourniture_stats.json');
let compteur = {};

try {
  if (fs.existsSync(statsPath)) {
    const content = fs.readFileSync(statsPath, 'utf-8');
    compteur = JSON.parse(content);
  }
} catch (err) {
  console.error("Erreur de lecture du fichier de stats:", err);
}

// Mettre à jour le compteur directement
if (Array.isArray(formData.fournitures)) {
  formData.fournitures.forEach(item => {
    const nom = item.nom?.trim() || 'Inconnu';
    compteur[nom] = (compteur[nom] || 0) + 1;
  });
}

// Écrire le compteur directement au format demandé
fs.writeFileSync(statsPath, JSON.stringify(compteur, null, 2));
          

        });
  
        fileStream.on('error', (err) => {
          reject(err);
        });
  
      } catch (error) {
        reject(error);
      }
    });
  }
  



// export function generateRapportPDF(formData, res) {
//     return new Promise((resolve, reject) => {
//         try {
//             const doc = new PDFDocument();
            
//             // Set up response headers
//             setupResponseHeaders(res);
            
//             // Handle stream errors
//             doc.on('error', (err) => {
//                 reject(err);
//             });
            
//             // Pipe to response
//             doc.pipe(res);
            
//             // Page configuration
//             const config = {
//                 margin: 20,
//                 doubleBoxX: 100,
//                 doubleBoxWidth: doc.page.width - 200
//             };
            
//             // Add header section
//             addHeaderSection(doc, formData, config);
            
//             // Add client information table
//             addClientInfoTable(doc, formData, config);
            
//             // Add vehicle specifications table
//             addVehicleSpecsTable(doc, formData, config);
            
//             // Add damage description section
//             addDamageDescriptionSection(doc, formData, config);
            
//             // Add new page for repair costs
//             doc.addPage();
            
//             // Add supplies section
//             const supplyY = addSuppliesSection(doc, formData, config);
            
//             // Add labor section
//             addLaborSection(doc, formData, config, supplyY);
            
//             addFraisAnnexesSection(doc, formData, config);

//             // Add signature page
//             addSignaturePage(doc);
            
//             // Finalize the document
//             doc.end();
            
//             // Resolve the promise when finished
//             res.on('finish', resolve);
            
//         } catch (error) {
//             // Handle errors before headers are sent
//             reject(error);
//         }
//     });
// }


function setupResponseHeaders(res) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=`rapport_expertise_${formData.assure}.pdf`');
}


function addHeaderSection(doc, formData, config) {
    const { margin } = config;
    const tableWidth = doc.page.width - margin * 2;
    const tableHeight = 80;
    const tableStartY = 40;
    const textPadding = 10;
    
    // Header rectangle
    doc.rect(margin, tableStartY, tableWidth, tableHeight).stroke();
    
    // Title
    doc.fontSize(18)
        .font('Helvetica-Bold')
        .text("RAPPORT D'EXPERTISE", margin + textPadding, tableStartY + textPadding, {
            align: 'center'
        });
    
    // Exam date
    doc.fontSize(12)
        .font('Helvetica')
        .text(`Date d'examen : ${formData.dateExamen}`, margin + textPadding, tableStartY + 40, {
            align: 'right'
        });
    
    // General information line
    const currentY = tableStartY + tableHeight + 10;
    
    doc.fontSize(12)
       .font('Helvetica-Bold').text('MANDANT : ', 30, currentY, { continued: true })
       .font('Helvetica').text(`${formData.mandant}                    `, { continued: true })
       .font('Helvetica-Bold').text('AGENCE : ', { continued: true })
       .font('Helvetica').text(`${formData.agence}                    `, { continued: true })
       .font('Helvetica-Bold').text('Date Accident : ', { continued: true })
       .font('Helvetica').text(`${formData.dateAccident}`, { continued: true });
}


function addClientInfoTable(doc, formData, config) {
    const { margin } = config;
    const currentY = 150; // Position after header
    const secondTableStartY = currentY + 20;
    const secondTableWidth = doc.page.width - 40;
    const cellHeight = 20;
    const numberOfRows = 7;
    const secondTableHeight = numberOfRows * cellHeight;
    
    // Draw table border
    doc.rect(20, secondTableStartY, secondTableWidth, secondTableHeight).stroke();
    
    const titleBottomY = secondTableStartY + cellHeight * 2;
    
    const leftX = 30;
    const rightX = doc.page.width / 2 + 10;
    let leftY = titleBottomY;
    let rightY = titleBottomY;
    
    doc.fontSize(12);
    
    // Left column
    doc.font('Helvetica-Bold').text('Assuré(e) : ', leftX, leftY-15, { continued: true })
        .font('Helvetica').text(`${formData.assure || ''} `);
    leftY += cellHeight;
    
    doc.font('Helvetica-Bold').text('Adresse : ', leftX, leftY, { continued: true })
        .font('Helvetica').text(`${formData.contratAssure || ''}`);
    leftY += cellHeight;
    
    doc.font('Helvetica-Bold').text('Téléphone : ', leftX, leftY, { continued: true })
        .font('Helvetica').text(`${formData.dossier || ''}`);
    leftY += cellHeight;
    
    doc.font('Helvetica-Bold').text('Véhicule : ', leftX, leftY, { continued: true })
        .font('Helvetica').text(`${formData.immatriculation || ''}`);
    leftY += cellHeight;
    
    // Right column
    doc.font('Helvetica-Bold').text('Tiers : ', rightX, rightY, { continued: true })
        .font('Helvetica').text(`${formData.tiers || ''}`);
    rightY += cellHeight;
    
    doc.font('Helvetica-Bold').text('Contrat Tiers : ', rightX, rightY, { continued: true })
        .font('Helvetica').text(`${formData.contratTiers || ''}`);
    rightY += cellHeight;
    
    doc.font('Helvetica-Bold').text('Compagnie adverse : ', rightX, rightY, { continued: true })
        .font('Helvetica').text(`${formData.cieAdv || ''}`);
    rightY += cellHeight;
    
    doc.font('Helvetica-Bold').text('Immatriculation Véhicule Tier : ', rightX, rightY, { continued: true })
        .font('Helvetica').text(`${formData.immatriculationTiers || ''}`);
    rightY += cellHeight;
    
    // Additional info below the table
    const belowsecondTableY = secondTableStartY + secondTableHeight + 15;
    
    doc.fontSize(12)
        .font('Helvetica-Bold').text('Date d\'Examen : ', 30, belowsecondTableY, { continued: true })
        .font('Helvetica').text(`${formData.dateExamen}       `, { continued: true })
        .font('Helvetica-Bold').text(' Véh. Expertisé: : ', { continued: true })
        .font('Helvetica').text(`${formData.vehExpertise}     `, { continued: true })
        .font('Helvetica-Bold').text('Lieu d\'Examen : ', { continued: true })
        .font('Helvetica').text(`${formData.lieuExamen}     `, { continued: true });
    console.log("currentY:",currentY)
}


function addVehicleSpecsTable(doc, formData, config) {
    const currentY = 150; 
    const secondTableStartY = currentY + 20;
    const thirdTableStartY = secondTableStartY + 180;
    const colStartY = thirdTableStartY + 15;
    const rowHeight = 20;
    const thirdTableWidth = doc.page.width - 40;
    const thirdTableHeight = 4 * rowHeight + 20;
    
    // Draw table border
    doc.rect(20, thirdTableStartY, thirdTableWidth, thirdTableHeight).stroke();
    
    // Column X positions
    const col1X = 30;
    const col2X = 200;
    const col3X = 400;
    
    // Extract data from formData
    const {
        marque = '',
        type = '',
        genre = '',
        numSerie = '',
        couleur = '',
        date1MC = '',
        puissance = '',
        etatVeh = '',
        circonstance = '',
        indexKm = '',
        energie = '',
        vn = '',
        vv = ''
    } = formData;
    
    // Column 1
    let y1 = colStartY;
    doc.font('Helvetica-Bold').text('Marque : ', col1X, y1 - 13, { continued: true })
        .font('Helvetica').text(marque); y1 += rowHeight;
    doc.font('Helvetica-Bold').text('Type : ', col1X, y1, { continued: true })
        .font('Helvetica').text(type); y1 += rowHeight;
    doc.font('Helvetica-Bold').text('Puissance : ', col1X, y1, { continued: true })
        .font('Helvetica').text(puissance); y1 += rowHeight;
    doc.font('Helvetica-Bold').text('Index Km : ', col1X, y1, { continued: true })
        .font('Helvetica').text(indexKm);
    
    // Column 2
    let y2 = colStartY;
    doc.font('Helvetica-Bold').text('Genre : ', col2X, y2, { continued: true })
        .font('Helvetica').text(genre); y2 += rowHeight;
    doc.font('Helvetica-Bold').text('Couleur : ', col2X, y2, { continued: true })
        .font('Helvetica').text(couleur); y2 += rowHeight;
    doc.font('Helvetica-Bold').text('Etat veh. : ', col2X, y2, { continued: true })
        .font('Helvetica').text(etatVeh); y2 += rowHeight;
    doc.font('Helvetica-Bold').text('Energie : ', col2X, y2, { continued: true })
        .font('Helvetica').text(energie);
    
    // Column 3
    let y3 = colStartY;
    doc.font('Helvetica-Bold').text('N° série : ', col3X, y3, { continued: true })
        .font('Helvetica').text(numSerie); y3 += rowHeight;
    doc.font('Helvetica-Bold').text('Date 1° MC : ', col3X, y3, { continued: true })
        .font('Helvetica').text(date1MC); y3 += rowHeight;
    doc.font('Helvetica-Bold').text('Circonstance : ', col3X, y3, { continued: true })
        .font('Helvetica').text(circonstance); y3 += rowHeight;
    doc.font('Helvetica-Bold').text('VN : ', col3X, y3, { continued: true })
        .font('Helvetica').text(vn + '    ', { continued: true })
        .font('Helvetica-Bold').text('VV : ', { continued: true })
        .font('Helvetica').text(vv);
}


function addDamageDescriptionSection(doc, formData, config) {
    const { doubleBoxX, doubleBoxWidth } = config;
    const doubleBoxStartY = 460; // Position after vehicle specs
    const doubleBoxHeight = 40;
    
    // Draw double border
    doc.rect(doubleBoxX, doubleBoxStartY, doubleBoxWidth, doubleBoxHeight).stroke();
    doc.rect(doubleBoxX + 3, doubleBoxStartY + 3, doubleBoxWidth - 6, doubleBoxHeight - 6).stroke();
    
    // Title
    doc.fontSize(16)
        .font('Helvetica-Bold')
        .text("NATURE DES CHOCS ET DÉGÂTS", doubleBoxX + 10, doubleBoxStartY + 10, {
            width: doubleBoxWidth - 20,
            align: 'center'
        });
    
    // Description text
    const descriptionStartY = doubleBoxStartY + doubleBoxHeight + 15;
    
    doc.fontSize(12)
        .font('Helvetica')
        .text(formData.description || '', doubleBoxX + 10, descriptionStartY, {
            width: doubleBoxWidth - 20,
            align: 'justify'
        });
}


function addSuppliesSection(doc, formData, config) {
    const { doubleBoxX, doubleBoxWidth } = config;
  
    const fournitureBoxHeight = 40;
    let titleFournitureY = 50;
  
    doc.rect(doubleBoxX, titleFournitureY, doubleBoxWidth, fournitureBoxHeight).stroke();
    doc.rect(doubleBoxX + 3, titleFournitureY + 3, doubleBoxWidth - 6, fournitureBoxHeight - 6).stroke();
  
    doc.fontSize(16)
      .font('Helvetica-Bold')
      .text("ESTIMATION DES FRAIS DE REPARATION", doubleBoxX + 10, titleFournitureY + 10, {
        width: doubleBoxWidth - 20,
        align: 'center'
      });
  
    doc.font('Helvetica')
      .fontSize(12)
      .text('FOURNITURES', doubleBoxX + 170, titleFournitureY + 53, { underline: true });
  
    const tableStartY = titleFournitureY + 80;
    const colWidths = [doubleBoxWidth * 0.6, doubleBoxWidth * 0.2, doubleBoxWidth * 0.2];
    const rowHeightF = 25;
    const padding = 8;
  
    let currentY = drawTableHeader(doc, doubleBoxX, tableStartY, doubleBoxWidth, colWidths, rowHeightF, padding);
    let totalTTC = 0;
  
    if (formData.fournitures && formData.fournitures.length > 0) {
      currentY = renderSuppliesTableData(doc, formData.fournitures, doubleBoxX, doubleBoxWidth, colWidths, rowHeightF, padding, currentY);
      const totalHT = calculateTotalPrice(formData.fournitures);
      const tva = totalHT * 0.19;
      totalTTC = totalHT + tva;
  
      if (willOverflow(doc, currentY, 80)) {
        doc.addPage();
        currentY = 50;
      }
  
      currentY += 10;
      renderTotalsLine(doc, 'TOTAL HT:', totalHT, 'Dt', doubleBoxX, colWidths, padding, currentY);
      currentY += 20;
      renderTotalsLine(doc, 'TVA (19%):', tva, 'Dt', doubleBoxX, colWidths, padding, currentY);
      currentY += 20;
  
      doc.moveTo(doubleBoxX, currentY - 7)
        .lineTo(doubleBoxX + doubleBoxWidth, currentY - 7)
        .stroke();
  
      renderTotalsLine(doc, 'TOTAL TTC:', totalTTC, 'Dt', doubleBoxX, colWidths, padding, currentY);
    }
  
    return { endY: currentY + 40, totalTTC };
  }
  


  function addLaborSection(doc, formData, config, startY) {
    const { doubleBoxX, doubleBoxWidth } = config;
  
    doc.font('Helvetica')
      .fontSize(12)
      .text("MAIN D'OEUVRE", doubleBoxX + 170, startY + 10, { underline: true });
  
    const tableStartY = startY + 40;
    const colWidths = [doubleBoxWidth * 0.7, doubleBoxWidth * 0.3];
    const rowHeightM = 25;
    const padding = 8;
  
    let currentY = drawLaborTableHeader(doc, doubleBoxX, tableStartY, doubleBoxWidth, colWidths, rowHeightM, padding);
    let totalMTTC = 0;
  
    if (formData.mainOeuvres && formData.mainOeuvres.length > 0) {
      currentY = renderLaborTableData(doc, formData.mainOeuvres, doubleBoxX, doubleBoxWidth, colWidths, rowHeightM, padding, currentY);
      const totalHT = calculateTotalPrice(formData.mainOeuvres);
      const tva = totalHT * 0.19;
      totalMTTC = totalHT + tva;
  
      if (willOverflow(doc, currentY, 60)) {
        doc.addPage();
        currentY = 50;
      }
  
      currentY += 10;
      renderTotalsLine(doc, 'TOTAL MAIN D\'OEUVRE HT :', totalHT, 'Dt', doubleBoxX, colWidths, padding, currentY);
      currentY += 20;
      renderTotalsLine(doc, 'TVA (19%):', tva, 'Dt', doubleBoxX, colWidths, padding, currentY);
      currentY += 20;
  
      doc.moveTo(doubleBoxX, currentY - 7)
        .lineTo(doubleBoxX + doubleBoxWidth, currentY - 7)
        .stroke();
  
      renderTotalsLine(doc, 'TOTAL MAIN D\'OEUVRE TTC:', totalMTTC, 'Dt', doubleBoxX, colWidths, padding, currentY);
    }
  
    return { endY: currentY + 40, totalTTC: totalMTTC };
  }
  



  function addSignaturePage(doc) {
    doc.addPage();
    doc.fontSize(12).text('Signature de l\'expert', {
        align: 'right',
        baseline: 'bottom'
    });
}


function drawTableHeader(doc, x, y, width, colWidths, rowHeight, padding) {
    doc.fontSize(12).font('Helvetica-Bold');
    doc.rect(x, y, width, rowHeight).stroke();

    // Draw column separators for header
    doc.moveTo(x + colWidths[0], y)
       .lineTo(x + colWidths[0], y + rowHeight)
       .stroke();
    doc.moveTo(x + colWidths[0] + colWidths[1], y)
       .lineTo(x + colWidths[0] + colWidths[1], y + rowHeight)
       .stroke();
        
    doc.text('Nom', x + padding, y + 7, { width: colWidths[0] - 2 * padding });
    doc.text('Prix (Dt)', x + colWidths[0] + padding, y + 7, { width: colWidths[1] - 2 * padding });
    doc.text('Remise (%)', x + colWidths[0] + colWidths[1] + padding, y + 7, { width: colWidths[2] - 2 * padding });
    
    return y + rowHeight;
}


function drawLaborTableHeader(doc, x, y, width, colWidths, rowHeight, padding) {
    doc.fontSize(12).font('Helvetica-Bold');
    doc.rect(x, y, width, rowHeight).stroke();
    
    // Draw column separator for header
    doc.moveTo(x + colWidths[0], y)
       .lineTo(x + colWidths[0], y + rowHeight)
       .stroke();
       
    doc.text('Nom', x + padding, y + 7, { width: colWidths[0] - 2 * padding });
    doc.text('Prix (Dt)', x + colWidths[0] + padding, y + 7, { width: colWidths[1] - 2 * padding });
    
    return y + rowHeight;
}


function renderSuppliesTableData(doc, items, x, width, colWidths, rowHeight, padding, startY) {
    let currentY = startY;

    items.forEach((item) => {
        if (willOverflow(doc, currentY, rowHeight)) {
            doc.addPage();
            currentY = 50;
            currentY = drawTableHeader(doc, x, currentY, width, colWidths, rowHeight, padding);
        }

        doc.rect(x, currentY, width, rowHeight).stroke();

        doc.moveTo(x + colWidths[0], currentY)
           .lineTo(x + colWidths[0], currentY + rowHeight)
           .stroke();
        doc.moveTo(x + colWidths[0] + colWidths[1], currentY)
           .lineTo(x + colWidths[0] + colWidths[1], currentY + rowHeight)
           .stroke();

        doc.fontSize(11).font('Helvetica');
        doc.text(item.nom?.trim() || '', x + padding, currentY + 7, { width: colWidths[0] - 2 * padding });

        const prix = typeof item.prix === 'number' ? item.prix.toFixed(2) : '0.00';
        doc.text(prix, x + colWidths[0] + padding, currentY + 7, {
            width: colWidths[1] - 2 * padding,
            align: 'right'
        });

        const remise = typeof item.remise === 'number' ? item.remise.toFixed(2) : '0.00';
        doc.text(remise, x + colWidths[0] + colWidths[1] + padding, currentY + 7, {
            width: colWidths[2] - 2 * padding,
            align: 'right'
        });

        currentY += rowHeight;
    });

    return currentY;
}



function renderLaborTableData(doc, items, x, width, colWidths, rowHeight, padding, startY) {
    let currentY = startY;
    const bottomMargin = 80; // Space reserved for continuation text
    
    // Render each row
    items.forEach((item, index) => {
        // Check remaining items to avoid orphaned rows
        const remainingItems = items.length - index;
        const minItemsOnPage = Math.min(2, remainingItems);
        
        if (willOverflow(doc, currentY, (minItemsOnPage * rowHeight) + bottomMargin)) {
            doc.addPage();
            currentY = 70;
            
            // Redraw header on new page
            currentY = drawLaborTableHeader(doc, x, currentY, width, colWidths, rowHeight, padding);
        }
        
        // Draw row rectangle
        doc.rect(x, currentY, width, rowHeight).stroke();
        
        // Draw column separator
        doc.moveTo(x + colWidths[0], currentY)
           .lineTo(x + colWidths[0], currentY + rowHeight)
           .stroke();
        
        // Fill data
        doc.fontSize(11).font('Helvetica');
        doc.text(item.nom.trim(), x + padding, currentY + 7, { width: colWidths[0] - 2 * padding });
        
        // Right-align price
        doc.text(item.prix.toFixed(2), x + colWidths[0] + padding, currentY + 7, { 
            width: colWidths[1] - 2 * padding,
            align: 'right'
        });
        
        // Move to next row
        currentY += rowHeight;
    });
    
    return currentY;
}


function renderTotalsLine(doc, label, amount, currency, x, colWidths, padding, y) {
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(label, x, y, { width: colWidths[0] - padding, align: 'right' });
    doc.text(amount.toFixed(2) + ` ${currency}`, x + colWidths[0] + padding, y, { 
        width: colWidths[1] - 2 * padding,
        align: 'right'
    });
}


function calculateTotalPrice(items) {
    return items.reduce((sum, item) => sum + item.prix, 0);
}


function willOverflow(doc, yPosition, height) {
    return yPosition + height > doc.page.height - 50;
}

function addFraisAnnexesSection(doc, formData, config) {
    const { doubleBoxX, doubleBoxWidth } = config;
    const leftX = 30;
    const rightX = leftX + 320;
    const lineHeight = 20;
    const lignes = [
        { label: "F. Ouv Dossier .....................................", key: "OuvDossier" },
        { label: "F. Enquête ............................................", key: "enquête" },
        { label: "Déplacements .....................................", key: "Déplacements" },
        { label: "Frais 2ème Exp ...................................", key: "Frais2èmeExp" },
        { label: "Photos .................................................", key: "Photos" },
        { label: "Frais PTT et Autres ............................", key: "FraisPTTAutres" },
        { label: "Honoraires ..........................................", key: "Honoraires" }
    ];

    const titleHeight = 30;
    const boxPadding = 10;
    const clientBoxHeight = 73;
    const finalTextHeight = 5;
    const totalLines = lignes.length + 3;
    const contentHeight = totalLines * lineHeight + 10 + clientBoxHeight + finalTextHeight;
    const boxHeight = titleHeight + contentHeight + boxPadding;

    let startY = doc.y + 40;
    const adjustedWidth = doc.page.width - leftX - 30;

    if (startY + boxHeight > doc.page.height - 50) {
        doc.addPage();
        startY = 50;
    }

    // 🔲 Grand rectangle
    doc.rect(leftX, startY, adjustedWidth, boxHeight).stroke();


    // 📄 Contenu
    let currentY = startY + titleHeight;
    doc.fontSize(12).font('Helvetica');

    let totalHT = 0;
    lignes.forEach(ligne => {
        const montant = parseFloat(formData[ligne.key]) || 0;
        totalHT += montant;
        doc.font('Helvetica-Bold')
           .text(`${ligne.label} : `, leftX + boxPadding, currentY, { continued: true })
           .font('Helvetica')
           .text(`${montant.toFixed(3)} Dt`);
        currentY += lineHeight;
    });

    currentY += 6;

    const tva = totalHT * 0.19;
    const totalTTC = totalHT + tva;

    doc.moveTo(leftX, currentY - 7)
       .lineTo(leftX + adjustedWidth - 250, currentY - 7)
       .stroke();

    doc.font('Helvetica-Bold')
       .text("TOTAL HORS T.V.A ............................. :", leftX + boxPadding, currentY, { continued: true })
       .font('Helvetica')
       .text(`${totalHT.toFixed(3)} Dt`);
    currentY += lineHeight;

    doc.font('Helvetica-Bold')
       .text("T.V.A (19%) .......................................... :", leftX + boxPadding, currentY, { continued: true })
       .font('Helvetica')
       .text(`${tva.toFixed(3)} Dt`);
    currentY += lineHeight;

    doc.moveTo(leftX, currentY - 7)
       .lineTo(leftX + adjustedWidth - 250, currentY - 7)
       .stroke();

    doc.font('Helvetica-Bold')
       .text("TOTAL NOTE ....................................... :", leftX + boxPadding, currentY, { continued: true })
       .font('Helvetica')
       .text(`${totalTTC.toFixed(3)} Dt`);
    currentY += lineHeight + 5;

    // 🔳 Cadre informations client (à l'intérieur du grand rectangle)
    const clientBoxX = leftX + boxPadding;
    const clientBoxY = currentY;
    const clientBoxWidth = 250;
    doc.rect(clientBoxX, clientBoxY, clientBoxWidth, clientBoxHeight).stroke();

    const labelFontSize = 9;
    const lineSpacing = 14;
    let textY = clientBoxY + 5;

    doc.fontSize(labelFontSize);
    const drawClientInfo = (label, value) => {
        doc.font('Helvetica-Bold')
           .text(`${label}: `, clientBoxX + 5, textY, { continued: true })
           .font('Helvetica')
           .text(`${value || ''}`);
        textY += lineSpacing;
    };

    drawClientInfo('V/R : Sinistre N°', formData.dossier);
    drawClientInfo('Police N°', formData.contratAssure);
    drawClientInfo('Accident du', formData.dateAccident);
    drawClientInfo('Assuré(e)', formData.assure);
    drawClientInfo('CIE Adverse', formData.cieAdv);

    // 🔠 Montant en lettres (dans le grand rectangle)
    const montantEnLettres = convertirMontantEnLettres(totalTTC);
    const rightTextX = rightX + boxPadding;
    const textBlockY = clientBoxY;

    doc.fontSize(10)
       .font('Helvetica-Oblique')
       .text('La somme de : ', rightTextX, textBlockY - 180, {
           width: adjustedWidth - boxPadding * 2,
           continued: true
       }) 
       .font('Helvetica-Bold')
       .text(montantEnLettres);

    doc.fontSize(10)
       .font('Helvetica-Oblique')
       .text(`En Règlement de mes honoraires et des frais\nd'expertise du véhicule : `, rightTextX, textBlockY -120, {
           width: adjustedWidth - boxPadding * 2,
           continued: true
       })
       .font('Helvetica-Bold')
       .text(formData.immatriculation || 'Immatriculation non disponible', { continued: true })
       .font('Helvetica-Oblique')
       .text(`\nappartenant au tiers.`);

    // ✅ Mise à jour de doc.y après tout
    doc.y = startY + boxHeight + 20;
}





function convertirMontantEnLettres(montant) {
    const entier = Math.floor(montant);
    const decimales = Math.round((montant - entier) * 1000);

    const entierEnLettres = numberToWords(entier, { lang: 'fr' });
    const decimalesEnLettres = decimales > 0 ? ` et ${numberToWords(decimales, { lang: 'fr' })}` : '';

    return ` \n${entierEnLettres} \n ${decimalesEnLettres} dinars`;
}


function addImagesToPDF(doc, images, config) {
    const imageDir = path.resolve(__dirname, '../public/images');
    const imageWidth = 200; // Largeur des images
    const imageHeight = 200; // Hauteur estimée des images (ajustable selon ton besoin)
    const verticalSpacing = 100;

    const pageHeight = doc.page.height;
    const topMargin = config.margin;
    const bottomMargin = config.margin;
    const usableHeight = pageHeight - topMargin - bottomMargin;

    let currentY = doc.y;

    images.forEach((imageFileName, index) => {
        if (!imageFileName) {
            console.warn(`Image ${index} non valide, nom de fichier manquant.`);
            return;
        }

        const imagePath = path.join(imageDir, imageFileName);

        if (!fs.existsSync(imagePath)) {
            console.warn(`Image ${imageFileName} introuvable dans ${imageDir}`);
            return;
        }

        // Si l'image dépasse la hauteur disponible, ajouter une nouvelle page
        if ((currentY + imageHeight + verticalSpacing) > pageHeight - bottomMargin) {
            doc.addPage();
            currentY = topMargin;
        }

        const imageX = (doc.page.width - imageWidth) / 2; // Centré horizontalement

        try {
            doc.image(imagePath, imageX, currentY, { width: imageWidth });
            currentY += imageHeight + verticalSpacing;
            doc.y = currentY; // Met à jour la position Y du document
        } catch (err) {
            console.error(`Erreur lors de l'ajout de l'image ${imageFileName}:`, err);
        }
    });
}



export function uploadImages(req, res) {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }
  
    const files = req.files;
    const fileNames = files.map(file => {
      // Le fichier est déjà dans public/images grâce au middleware localUpload
      return `${file.filename}`;
    });
  
    return res.status(200).json({ 
      message: 'Images uploadées localement avec succès', 
      files: fileNames 
    });
  }
  
  
  

export function deleteImages() {
    const imageDir = path.join(process.cwd(), 'public', 'images');
    try {
        const files = fs.readdirSync(imageDir);
        files.forEach(file => {
            const filePath = path.join(imageDir, file);
            if (/\.(png|jpg|jpeg|gif)$/i.test(file)) {
                fs.unlinkSync(filePath); // supprimer l'image
            }
        });
        console.log('Images supprimées avec succès.');
    } catch (err) {
        console.error('Erreur lors de la suppression des images :', err);
    }
}



export async function saveExpertise(formData, pdfFilename, fournitureTTC, mainOeuvreTTC) {
    try {
      const montantTotal = fournitureTTC + mainOeuvreTTC;
  
      const newExpertise = new Expertises({
        montant: montantTotal,
        expert: formData.expertId,
        rapport: [pdfFilename]
      });
  
      await newExpertise.save();
      console.log('✅ Expertise enregistrée avec succès.');
    } catch (err) {
      console.error('❌ Erreur lors de l’enregistrement de l’expertise :', err);
    }
}



export async function getRapportByExpert(req, res) {
    try {
      const { expertId } = req.params;
      const rapports = await Expertises.find({ expert: expertId }).populate('expert');
      res.status(200).json(rapports);
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports par expert :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
}
  


export async function getAllRapports(req, res) {
    try {
      const rapports = await Expertises.find().populate('expert');
      res.status(200).json(rapports);
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les rapports :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
}
  