import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { degrees, PDFDocument, PDFFont, PDFPage, RGB, rgb, StandardFonts } from 'pdf-lib'; // Importez StandardFonts pour les polices standard
import html2canvas from 'html2canvas';
type VehicleKey = 'vehicleA_car' | 'vehicleA_moto' | 'vehicleB_car' | 'vehicleB_moto';

@Component({
  selector: 'app-brise-glace',
  templateUrl: './brise-glace.component.html',
  styleUrl: './brise-glace.component.scss'
})
export class BriseGlaceComponent {
  accidentForm: FormGroup;


  vehiclesZones: Record<VehicleKey, { x: number; y: number; clicked: boolean }[]> = {
    vehicleA_car: [
      { x: 5, y: 40, clicked: false },
      { x: 85, y: 40, clicked: false },
      { x: 165, y: 40, clicked: false },
      { x: 5, y: 120, clicked: false },
      { x: 165, y: 120, clicked: false },
      { x: 5, y: 200, clicked: false },
      { x: 85, y: 200, clicked: false },
      { x: 165, y: 200, clicked: false },
    ],
    vehicleA_moto: [
      { x: 5, y: 40, clicked: false },
      { x: 85, y: 40, clicked: false },
      { x: 165, y: 40, clicked: false },
      { x: 5, y: 120, clicked: false },
      { x: 165, y: 120, clicked: false },
      { x: 5, y: 200, clicked: false },
      { x: 85, y: 200, clicked: false },
      { x: 165, y: 200, clicked: false },
    ],
    vehicleB_car: [
      { x: 5, y: 40, clicked: false },
      { x: 85, y: 40, clicked: false },
      { x: 165, y: 40, clicked: false },
      { x: 5, y: 120, clicked: false },
      { x: 165, y: 120, clicked: false },
      { x: 5, y: 200, clicked: false },
      { x: 85, y: 200, clicked: false },
      { x: 165, y: 200, clicked: false },
    ],
    vehicleB_moto: [
      { x: 5, y: 40, clicked: false },
      { x: 85, y: 40, clicked: false },
      { x: 165, y: 40, clicked: false },
      { x: 5, y: 120, clicked: false },
      { x: 165, y: 120, clicked: false },
      { x: 5, y: 200, clicked: false },
      { x: 85, y: 200, clicked: false },
      { x: 165, y: 200, clicked: false },
    ],
  };

  constructor(private fb: FormBuilder) {
    // Création du formulaire avec les champs nécessaires
    this.accidentForm = this.fb.group({
      // Champs généraux
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      blesse: ['', Validators.required],

      // Dégâts matériels
      otherDamages: ['', Validators.required],

      // Témoins
      witnessName: [''],
      witnessAddress: [''],
      witnessPhone: [''],

      // Véhicule A
      insuranceCompanyA: ['', Validators.required],
      agencyA: ['', Validators.required],
      contractNumberA: ['', Validators.required],
      validFromA: ['', Validators.required],
      validToA: ['', Validators.required],
      // Informations sur le conducteur du véhicule A
      driverNameA: ['', Validators.required],
      driverFirstNameA: ['', Validators.required],
      driverAddressA: ['', Validators.required], // ✅ Adresse ajoutée
      driverPhoneA: ['', Validators.required], // ✅ Téléphone ajouté
      driverLicenseNumberA: ['', Validators.required],
      driverLicenseIssuedDateA: ['', Validators.required], // ✅ Date de délivrance du permis ajoutée
      // Informations sur le véhicule A
      vehicleRegistrationA: ['', Validators.required],
      vehicleBrandA: ['', Validators.required],
      vehicleModelA: ['', Validators.required], // ✅ Modèle du véhicule ajouté
      vehicleColorA: ['', Validators.required], // ✅ Couleur du véhicule ajoutée    
      // Informations sur l'assuré
      insuredNameA: ['', Validators.required], // ✅ Nom de l'assuré ajouté
      insuredFirstNameA: ['', Validators.required], // ✅ Prénom de l'assuré ajouté
      insuredAddressA: ['', Validators.required], // ✅ Adresse de l'assuré ajoutée
      insuredPhoneA: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté
      venantA: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté
      allantA: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté



      // Véhicule B
      insuranceCompanyB: ['', Validators.required],
      agencyB: ['', Validators.required],
      contractNumberB: ['', Validators.required],
      validFromB: ['', Validators.required],
      validToB: ['', Validators.required],
      // Informations sur le conducteur du véhicule A
      driverNameB: ['', Validators.required],
      driverFirstNameB: ['', Validators.required],
      driverAddressB: ['', Validators.required], // ✅ Adresse ajoutée
      driverPhoneB: ['', Validators.required], // ✅ Téléphone ajouté
      driverLicenseNumberB: ['', Validators.required],
      driverLicenseIssuedDateB: ['', Validators.required], // ✅ Date de délivrance du permis ajoutée
      // Informations sur le véhicule A
      vehicleRegistrationB: ['', Validators.required],
      vehicleBrandB: ['', Validators.required],
      vehicleModelB: ['', Validators.required], // ✅ Modèle du véhicule ajouté
      vehicleColorB: ['', Validators.required], // ✅ Couleur du véhicule ajoutée    
      // Informations sur l'assuré
      insuredNameB: ['', Validators.required], // ✅ Nom de l'assuré ajouté
      insuredFirstNameB: ['', Validators.required], // ✅ Prénom de l'assuré ajouté
      insuredAddressB: ['', Validators.required], // ✅ Adresse de l'assuré ajoutée
      insuredPhoneB: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté
      venantB: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté
      allantB: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté

    });
  }

  private convertRGB(r: number, g: number, b: number): RGB {
    return rgb(r / 255, g / 255, b / 255); // Retourne un objet RGB
  }
  
  

  // Fonction pour activer/désactiver la croix sur la zone cliquée
  toggleCross(vehicleKey: VehicleKey, index: number): void {
    if (this.vehiclesZones[vehicleKey] && this.vehiclesZones[vehicleKey][index]) {
      this.vehiclesZones[vehicleKey][index].clicked = !this.vehiclesZones[vehicleKey][index].clicked;
    }
  }
  



  async createPdf() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Police en gras
  
    // Ajouter le logo en haut à gauche
    const logoUrl = 'assets/img/logo_ftusa.png';
    const logoImage = await fetch(logoUrl).then(res => res.blob()).then(blob => blob.arrayBuffer());
    const logo = await pdfDoc.embedPng(logoImage);
    page.drawImage(logo, { x: 20, y: 750, width: 100, height: 50 });
  
    // Ajouter le titre en gras et en grand
    const title = "Constat amiable d'accident automobile";
    page.drawText(title, {
      x: 120, // Centrer horizontalement
      y: 760, // Placer en haut
      size: 16, // Taille du texte
      font: boldFont, // Texte en gras
      color: rgb(0, 0, 0) // Couleur noire
    });
  
    // Texte sous le titre à gauche (petit)
    page.drawText("À signer obligatoirement par les DEUX conducteurs", {
      x: 320, // Aligné à gauche
      y: 740, // Placer sous le titre
      size: 4.3, // Petite taille
      font: font, // Police normale
      color: rgb(0, 0, 0) // Noir
    });
  
    // Texte sous le titre à droite (petit)
    page.drawText("Ne constitue pas une reconnaissance de responsabilité, mais un relevé des identités et des faits, servant à l’accélération du règlement", {
      x: 20, // Aligné à droite
      y: 740, // Placer sous le titre
      size: 4.3, // Petite taille
      font: font, // Police normale
      color: rgb(0, 0, 0),
      maxWidth: 260 // Ajuster la largeur pour éviter le chevauchement
    });
  

  
    // Laisser un espace avant le tableau
    const startX = 50, startY = 701, cellWidth = 130, cellHeight = 30;
    
    // Dessiner le tableau avec les infos de l'accident
    const headers = ["Date", "Heure", "Lieu", "Blessé", "Dégâts", "Témoin", "Adresse", "Téléphone"];
    const values = [
        this.accidentForm.value.date || "N/A",
        this.accidentForm.value.time || "N/A",
        this.accidentForm.value.location || "N/A",
        this.accidentForm.value.blesse || "N/A",
        this.accidentForm.value.otherDamages || "N/A",
        this.accidentForm.value.witnessName || "N/A",
        this.accidentForm.value.witnessAddress || "N/A",
        this.accidentForm.value.witnessPhone || "N/A"
    ];
    this.drawTable(page, font, headers, values, startX, startY, cellWidth, cellHeight);
  
    // Ajouter les infos des véhicules
    const endTableY = startY - Math.floor(headers.length / 4) * cellHeight;
    const vehiculeY = endTableY - 20;
    this.addVehicleInfo(page, font, pdfDoc, 'A', 80, vehiculeY);
    this.addVehicleInfo(page, font, pdfDoc, 'B', 280, vehiculeY);
  
    // Capture d’écran des véhicules avec les croix
    await this.captureVehicleImage(page, pdfDoc);
  
    // Ajouter le texte "Brise de glace" en grand et verticalement
    const briseDeGlace = "Brise de glace";
    page.drawText(briseDeGlace, {
      x: 460, // Adjust this value to position the text correctly
      y: 165, // Adjust this value to position the text correctly
      size: 70, // Large size for the text
      font: boldFont, // Bold font
      color: this.convertRGB(107, 106, 106), // Black color
      rotate: degrees(90) // Rotate the text 90 degrees
    });


    // Générer et télécharger le PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'constat-accident.pdf';
    link.click();
  }





private drawTable(page: PDFPage, font: PDFFont, headers: string[], values: string[], startX: number, startY: number, cellWidth: number, cellHeight: number) {
  const rowCount = headers.length;
  
  for (let i = 0; i < rowCount; i++) {
      const x = startX + (i % 4) * cellWidth; // 4 colonnes max
      const y = startY - Math.floor(i / 4) * cellHeight; // Nouvelle ligne toutes les 4 colonnes

      // Dessiner la cellule
      page.drawRectangle({
          x: x,
          y: y,
          width: cellWidth,
          height: cellHeight,
          borderWidth: 1,
          color: rgb(0.9, 0.9, 0.9) // Fond gris clair
      });

      // Ajouter le texte de l'en-tête
      page.drawText(headers[i], {
          x: x + 5,
          y: y + cellHeight - 15,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
      });

      // Ajouter la valeur correspondante
      page.drawText(values[i], {
          x: x + 5,
          y: y + 5,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
      });
  }
}



  async addCommonInfo(page: PDFPage, font: PDFFont) {
    
    // Ajouter des champs de texte pour chaque section
    this.addTextField(page, 'Date: ', 50, 700, 100, 30, this.accidentForm.value.date, font);
    this.addTextField(page, 'Heure: ', 160, 700, 100, 30, this.accidentForm.value.time, font);
    this.addTextField(page, 'Lieu: ', 270, 700, 100, 30, this.accidentForm.value.location, font);
    this.addTextField(page, 'Blessé: ', 380, 700, 100, 30, this.accidentForm.value.blesse, font);
    let currentY = 270;  // Position de départ

    this.addTextField(page, 'Dégâts matériels: ', 50, currentY, 150, 30, this.accidentForm.value.otherDamages, font);
    currentY -= 30;
  
    this.addTextField(page, 'Nom du témoin: ', 50, currentY, 150, 30, this.accidentForm.value.witnessName, font);
    currentY -= 30;
  
    this.addTextField(page, 'Adresse du témoin: ', 50, currentY, 150, 30, this.accidentForm.value.witnessAddress, font);
    currentY -= 30;
  
    this.addTextField(page, 'Téléphone du témoin: ', 50, currentY, 150, 30, this.accidentForm.value.witnessPhone, font);
    currentY -= 30;
  
    // Réduire l'espace avant de passer aux informations des véhicules
    return currentY;  // Retourne la position Y après avoir ajouté les informations communes
  }


 

async addVehicleInfo(page: PDFPage, font: PDFFont,pdfDoc: PDFDocument, vehicleType: string, x: number, y: number) {
  const color = (vehicleType === 'A') ? this.convertRGB(253, 252, 232) : this.convertRGB(224, 251, 238);
  const xOffset = (vehicleType === 'A') ? -50 : 50;
  let currentY = y;  // Position de départ pour le véhicule
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Informations sur la société d'assurance
  this.addStyledBox(page, `Société d'Assurances`, x + xOffset, currentY, 250, 30, '', boldFont, color);
  currentY -= 25
  this.addStyledBox(page, `Assurance Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`insuranceCompany${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Contrat d'Assurance Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`contractNumber${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Agence Assurance Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`agency${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Validité Assurance (Début) Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`validFrom${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Validité Assurance (Fin) Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`validTo${vehicleType}`], font, color);

  // Informations sur l'identité du conducteur
  currentY -= 25
  this.addStyledBox(page, `Identité du Conducteur Véhicule ${vehicleType} `, x + xOffset, currentY, 250, 30, '', boldFont, color);
  currentY -= 25
  this.addStyledBox(page, `Nom du Conducteur Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`driverName${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Prénom du Conducteur Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`driverFirstName${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Adresse du Conducteur Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`driverAddress${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Numéro Permis de Conduire Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`driverLicenseNumber${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Délivré le Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`driverLicenseIssuedDate${vehicleType}`], font, color);

  // Informations sur l'assuré
  currentY -= 25
  this.addStyledBox(page, `Assuré Véhicule ${vehicleType} `, x + xOffset, currentY, 250, 30, '', boldFont, color);
  currentY -= 25
  this.addStyledBox(page, `Nom de l'Assuré Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`insuredName${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Prénom de l'Assuré Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`insuredFirstName${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Adresse de l'Assuré Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`insuredAddress${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Téléphone de l'Assuré Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`insuredPhone${vehicleType}`], font, color);

  // Informations sur le véhicule
  currentY -= 25
  this.addStyledBox(page, `Identité du véhicule Véhicule ${vehicleType} `, x + xOffset, currentY, 250, 30, '', boldFont, color);
  currentY -= 25
  this.addStyledBox(page, `Marque et type du Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`vehicleBrand${vehicleType}`], font, color);
  currentY -= 25
  this.addStyledBox(page, `Immatriculation Véhicule ${vehicleType}: `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`vehicleRegistration${vehicleType}`], font, color);

  return currentY;  // Retourne la position Y après avoir ajouté toutes les informations sur le véhicule
}




  
  
  
  // Fonction pour ajouter un champ de texte simple dans le PDF
  private addTextField(page: PDFPage, label: string, x: number, y: number, width: number, height: number, value: string, font: any) {
    // Afficher le label et la valeur dans le même champ
    page.drawText(`${label} ${value}`, { x: x, y: y + 10, size: 12, font: font, color: rgb(0, 0, 0) });
  }
  

  // Fonction pour ajouter un champ de texte stylisé (avec fond coloré et ombre)
  private addStyledBox(page: PDFPage, label: string, x: number, y: number, width: number, height: number, value: string, font: any, color: RGB) {
    // Fond coloré avec bordure
    page.drawRectangle({
        x: x,
        y: y,
        width: width,
        height: height,
        color: color,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0) // Ajout d'une bordure noire pour mieux visualiser
    });

    // Ajustement du texte pour éviter qu'il dépasse
    const text = `${label} ${value}`;
    const textWidth = font.widthOfTextAtSize(text, 10); // Calculer la largeur du texte avec une police réduite
    const maxTextWidth = width - 10; // Réduire pour ne pas toucher les bords du rectangle

    let displayText = text;
    if (textWidth > maxTextWidth) {
        displayText = text.slice(0, 30) + "..."; // Tronquer le texte s'il dépasse la boîte
    }

    // Affichage du texte avec un léger décalage pour centrer
    page.drawText(displayText, {
        x: x + 5, // Petit décalage pour ne pas coller au bord gauche
        y: y + (height / 2) - 5, // Centrer verticalement
        size: 10, // Taille réduite pour éviter les dépassements
        font: font,
        // color: rgb(0, 0, 0)
    });
}

  

async captureVehicleImage(page: PDFPage, pdfDoc: PDFDocument) {
  // Sélection des containers de véhicules A et B
  const vehicleAContainers = document.querySelectorAll('.vehiclesA-container .car-container, .vehiclesA-container .moto-container');
  const vehicleBContainers = document.querySelectorAll('.vehiclesB-container .car-container, .vehiclesB-container .moto-container');

  async function captureAndDrawImage(container: HTMLElement, x: number, y: number) {
      const crosses = container.querySelectorAll('.cross');
      if (crosses.length === 0) {
          console.warn(`⚠️ Aucune croix trouvée dans ${container.className}, capture ignorée.`);
          return;
      }

      try {
          console.log(`📸 Capture en cours pour: ${container.className} avec ${crosses.length} croix.`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Assurer le rendu avant capture

          const canvas = await html2canvas(container,{backgroundColor:null});
          const imgData = canvas.toDataURL('image/png');

          // Ajout de l'image au PDF
          const img = await pdfDoc.embedPng(imgData);
          const { width, height } = img.scale(0.5);

          page.drawImage(img, { x, y, width, height });
          console.log(`✅ Image ajoutée aux coordonnées x: ${x}, y: ${y}`);
      } catch (error) {
          console.error("❌ Erreur lors de la capture d'écran:", error);
      }
  }

  // Capture et ajout des images uniquement si elles contiennent des croix
  let posY_A = -25, posY_B = 125; // Positions de départ pour affichage
  for (const container of Array.from(vehicleAContainers)) {
      await captureAndDrawImage(container as HTMLElement, 80, posY_A);
      posY_A -= 150; // Décaler la position pour éviter la superposition
  }
  for (const container of Array.from(vehicleBContainers)) {
      await captureAndDrawImage(container as HTMLElement, 380, posY_B);
      posY_B -= 150;
  }
}








  
}
