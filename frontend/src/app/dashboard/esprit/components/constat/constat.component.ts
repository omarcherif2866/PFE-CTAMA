import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { PDFDocument, PDFFont, PDFPage, RGB, rgb, StandardFonts } from 'pdf-lib'; // Importez StandardFonts pour les polices standard
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import { CdkDragDrop, CdkDragEnter, CdkDragMove, CdkDragRelease, CdkDragStart } from '@angular/cdk/drag-drop';
import { SharedService } from 'src/app/components/services/shared.service';
import { SinistreService } from 'src/app/components/services/sinistre.service';
import { Sinistre } from 'src/app/components/models/sinistre';
type VehicleKey = 'vehicleA_car' | 'vehicleA_moto' | 'vehicleB_car' | 'vehicleB_moto';

@Component({
  selector: 'app-constat',
  templateUrl: './constat.component.html',
  styleUrls: ['./constat.component.scss']
})


export class ConstatComponent {
  accidentForm: FormGroup;
  today: string;
  elements = [
    { name: 'Voiture A', img: 'assets/img/croqui/voitureJaune.png' },
    { name: 'Voiture B ', img: 'assets/img/croqui/voitureVert.png' },
    { name: 'Feu', img: 'assets/img/croqui/feu.png' },
    { name: 'Rond point', img: 'assets/img/croqui/rond point.png' },
    { name: 'Stop', img: 'assets/img/croqui/stop.png' },
    { name: 'Paneau rond point', img: 'assets/img/croqui/panneau rond point.png' },
    { name: 'panneau ceder le passage', img: 'assets/img/croqui/ceder le passage.png' },
    { name: 'panneau interdit', img: 'assets/img/croqui/interdit.png' },


  ];
  draggedElement: any;
  droppedElements: any[] = [];
  dragPosition: { x: number, y: number } = { x: 0, y: 0 };

  vehiclesZones: Record<VehicleKey, { x: number; y: number; clicked: boolean }[]> = {
    vehicleA_car: [
      { x: 0, y: 40, clicked: false },
      { x: 70, y: 40, clicked: false },
      { x: 140, y: 40, clicked: false },
      { x: 0, y: 120, clicked: false },
      { x: 140, y: 120, clicked: false },
      { x: 0, y: 200, clicked: false },
      { x: 70, y: 200, clicked: false },
      { x: 140, y: 200, clicked: false },
    ],
    vehicleA_moto: [
      { x: 0, y: 40, clicked: false },
      { x: 75, y: 40, clicked: false },
      { x: 149, y: 40, clicked: false },
      { x: 0, y: 120, clicked: false },
      { x: 149, y: 120, clicked: false },
      { x: 0, y: 200, clicked: false },
      { x: 75, y: 200, clicked: false },
      { x: 149, y: 200, clicked: false },
    ],
    
    vehicleB_car: [
      { x: 0, y: 40, clicked: false },
      { x: 70, y: 40, clicked: false },
      { x: 140, y: 40, clicked: false },
      { x: 0, y: 120, clicked: false },
      { x: 140, y: 120, clicked: false },
      { x: 0, y: 200, clicked: false },
      { x: 70, y: 200, clicked: false },
      { x: 140, y: 200, clicked: false },
    ],
    vehicleB_moto: [
      { x: 5, y: 40, clicked: false },
      { x: 75, y: 40, clicked: false },
      { x: 148, y: 40, clicked: false },
      { x: 5, y: 120, clicked: false },
      { x: 148, y: 120, clicked: false },
      { x: 5, y: 200, clicked: false },
      { x: 75, y: 200, clicked: false },
      { x: 148, y: 200, clicked: false },
    ],
  };

  constructor(private fb: FormBuilder,private cdr: ChangeDetectorRef, 
    private sharedService: SharedService,
      private sinistreService: SinistreService
   ) {
    this.today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
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
      vehicleBrandA: ['', [Validators.required, this.containsCommaValidator]],
      vehicleModelA: ['', Validators.required], // ✅ Modèle du véhicule ajouté
      vehicleColorA: ['', Validators.required], // ✅ Couleur du véhicule ajoutée    
      // Informations sur l'assuré
      insuredNameA: ['', Validators.required], // ✅ Nom de l'assuré ajouté
      insuredFirstNameA: ['', Validators.required], // ✅ Prénom de l'assuré ajouté
      insuredAddressA: ['', Validators.required], // ✅ Adresse de l'assuré ajoutée
      insuredPhoneA: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté
      venantA: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté
      allantA: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté
      degatsApparentsA: ['', Validators.required], 
      observationsA: ['', Validators.required], 



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
      vehicleBrandB: ['', [Validators.required, this.containsCommaValidator]],

      vehicleModelB: ['', Validators.required], // ✅ Modèle du véhicule ajouté
      vehicleColorB: ['', Validators.required], // ✅ Couleur du véhicule ajoutée    
      // Informations sur l'assuré
      insuredNameB: ['', Validators.required], // ✅ Nom de l'assuré ajouté
      insuredFirstNameB: ['', Validators.required], // ✅ Prénom de l'assuré ajouté
      insuredAddressB: ['', Validators.required], // ✅ Adresse de l'assuré ajoutée
      insuredPhoneB: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté
      venantB: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté
      allantB: ['', Validators.required], // ✅ Téléphone de l'assuré ajouté
      degatsApparentsB: ['', Validators.required], 
      observationsB: ['', Validators.required], 

    }, { validators: this.dateValidator }); // Ajout du validateur ici
  }

  ngOnInit() {
    console.log("Elements disponibles:", this.elements);
    console.log("onDrop function:", this.onDrop); // ✅ Vérifiez que la fonction est bien reconnue
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
      y: 748, // Placer sous le titre
      size: 4.3, // Petite taille
      font: font, // Police normale
      color: rgb(0, 0, 0) // Noir
    });
  
    // Texte sous le titre à droite (petit)
    page.drawText("Ne constitue pas une reconnaissance de responsabilité, mais un relevé des identités et des faits, servant à l’accélération du règlement", {
      x: 20, // Aligné à droite
      y: 748, // Placer sous le titre
      size: 4.3, // Petite taille
      font: font, // Police normale
      color: rgb(0, 0, 0),
      maxWidth: 260 // Ajuster la largeur pour éviter le chevauchement
    });
  
    // Laisser un espace avant le tableau
    const startX = 50, startY = 711, cellWidth = 130, cellHeight = 30;
  
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
    const vehiculeY = endTableY - 2;
    this.addVehicleInfo(page, font, pdfDoc, 'A', 80, vehiculeY);
    this.addVehicleInfo(page, font, pdfDoc, 'B', 280, vehiculeY);
  
    // Ajouter les checkboxes et les textes entre les véhicules
    const textsBetween = [
      { text: "en statlonnement", marginTop: -7 },
      { text: "quittait un stationnement", marginTop: -9 },
      { text: "prenait un stationnement", marginTop: -9 },
      { text: "sortait d'un parking, d'un lieu privé, d'un chemin de terre", marginTop: -9  },
      { text: "s'engageait dans un parking, un lieu privé un chemin de terre", marginTop: -18  },
      { text: "arrêt de circulation", marginTop: -9 },
      { text: "frottement sans changement de file", marginTop: -11 },
      { text: "heurtait à l'arriere, en roulant dans le même sens et sur une même file", marginTop: -21 },
      { text: "roulait dans le même sens et sur une file différente", marginTop: -23 },
      { text: "changeait de file", marginTop: -18 },
      { text: "doublait", marginTop: 10 },
      { text: "virait à droite", marginTop: -9 },
      { text: "virait à gauche", marginTop: -10 },
      { text: "reculait", marginTop: -8 },
      { text: "empiétait sur la partie de chaussé réservee à la circulation en sens inverse", marginTop: 7.5 },
      { text: "venait de droite (dans un carrefour)", marginTop: -19 },
      { text: "n'avait pas observé le signal de priorité", marginTop: -6 }
    ];
  
    let checkboxY = vehiculeY - 20;
    textsBetween.forEach((item, index) => {
      checkboxY -= item.marginTop!;
      // Case à cocher à gauche
      const textParts = this.wrapText(item.text, 103, font, 8); 
      page.drawRectangle({
        x: 230, // Position à gauche
        y: checkboxY,
        width: 10,
        height: 10,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1
      });
      // Texte centré
      textParts.forEach((line, i) => {
        page.drawText(line, {
          x: 250, // Centrer horizontalement
          y: checkboxY + 2 - (i * 10), // Décaler vers le bas pour la deuxième ligne
          size: 8,
          font: font,
          color: rgb(0, 0, 0)
        });
      });
      // Case à cocher à droite
      page.drawRectangle({
        x: 357, // Position à droite
        y: checkboxY,
        width: 10,
        height: 10,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1
      });
      checkboxY -= textParts.length * 10 + 5; 

      // Vérifier si la case est cochée et dessiner une marque de coche
      const checkboxLeft = document.querySelectorAll('.input-group-A .left-checkbox')[index] as HTMLInputElement;
      const checkboxRight = document.querySelectorAll('.input-group-B .right-checkbox')[index] as HTMLInputElement;
      console.log(`Index: ${index}, checkboxLeft: ${checkboxLeft}, checkboxRight: ${checkboxRight}`);
      if (checkboxLeft && checkboxLeft.checked) {
        page.drawText('X', {
          x: 232, // Position de la marque de coche à gauche
          y: checkboxY + 2,
          size: 8,
          font: font,
          color: rgb(0, 0, 0)
        });
      }
      if (checkboxRight && checkboxRight.checked) {
        page.drawText('X', {
          x: 372, // Position de la marque de coche à droite
          y: checkboxY + 2,
          size: 8,
          font: font,
          color: rgb(0, 0, 0)
        });
      }
  
      checkboxY -= 15; // Ajuster l'espacement entre les lignes
    });
  
    // Capture d’écran des véhicules avec les croix
    await this.captureVehicleImage(page, pdfDoc);
    await new Promise(resolve => setTimeout(resolve, 500));
    await this.captureCroquiImage(page,pdfDoc)
    await new Promise(resolve => setTimeout(resolve, 500));
    const croquiY = vehiculeY - 628; // Ajustez selon la disposition souhaitée
    await this.addCroquiInfo(page, font, pdfDoc, 'A', 80, croquiY);
    await this.addCroquiInfo(page, font, pdfDoc, 'B', 280, croquiY);


    const sinistreData = {
      date_survenance: this.accidentForm.value.date,
      date_declaration: new Date().toISOString().split('T')[0],
      num_police: this.accidentForm.value.contractNumberA,
      objet_assure: this.accidentForm.value.vehicleBrandA,
      description: this.accidentForm.value.observationsA,
      documents: null
    };

    this.sinistreService.addSinistre(sinistreData).subscribe(
      (response) => {
          console.log('Sinistre créé avec succès', response);
  
          // Mapper la réponse API à une instance de Sinistre
          const sinistre = this.mapApiResponseToSinistre(response);
  
          // Utiliser les getters pour accéder aux valeurs
          const reference = sinistre.Reference;
  
          Swal.fire({
              icon: 'success',
              title: 'Votre constat a été téléchargé avec succès',
              html: `A partir de la date d'aujourd'hui, vous avez 5 jours pour déposer votre constat.<br><br>
                     <strong>Référence sinistre : ${reference}</strong><br>
                     Conservez cette référence pour ajouter des documents ultérieurement.`,
          });
      },
      (error) => {
          console.error('Erreur lors de la création du sinistre', error);
      }
  );



    // Générer et télécharger le PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const { insuredNameA, insuredFirstNameA } = this.accidentForm.value;
    const fileName = `constat-accident-${insuredNameA} ${insuredFirstNameA}.pdf`;
    link.download = fileName;
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
  const xOffset = (vehicleType === 'A') ? -70 : 90;
  let currentY = y;  // Position de départ pour le véhicule
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Informations sur la société d'assurance
  this.addStyledBox(page, `Société d'Assurances`, x + xOffset, currentY, 250, 30, '', boldFont, color);
  currentY -= 21
  this.addStyledBox(page, `Véhicule assuré par  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`insuranceCompany${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Contrat d'Assurance  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`contractNumber${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Agence Assurance  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`agency${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Validité Assurance (Début)  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`validFrom${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Validité Assurance (Fin)  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`validTo${vehicleType}`], font, color);

  // Informations sur l'identité du conducteur
  currentY -= 21
  this.addStyledBox(page, `Identité     `, x + xOffset, currentY, 250, 30, '', boldFont, color);
  currentY -= 21
  this.addStyledBox(page, `Nom    : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`driverName${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Prénom    : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`driverFirstName${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Adresse    : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`driverAddress${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Numéro Permis de Conduire  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`driverLicenseNumber${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Délivré le  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`driverLicenseIssuedDate${vehicleType}`], font, color);

  // Informations sur l'assuré
  currentY -= 21
  this.addStyledBox(page, `Assuré   `, x + xOffset, currentY, 250, 30, '', boldFont, color);
  currentY -= 21
  this.addStyledBox(page, `Nom de l'Assuré  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`insuredName${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Prénom de l'Assuré  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`insuredFirstName${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Adresse de l'Assuré  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`insuredAddress${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Téléphone de l'Assuré  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`insuredPhone${vehicleType}`], font, color);

  // Informations sur le véhicule
  currentY -= 21
  this.addStyledBox(page, `Identité du véhicule   `, x + xOffset, currentY, 250, 30, '', boldFont, color);
  currentY -= 21
  this.addStyledBox(page, `Marque et type du  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`vehicleBrand${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Immatriculation  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`vehicleRegistration${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Sens suivi   `, x + xOffset, currentY, 250, 30, '', boldFont, color);
  currentY -= 21
  this.addStyledBox(page, `Venant de  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`venant${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Allant à  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`allant${vehicleType}`], font, color);

  return currentY;  // Retourne la position Y après avoir ajouté toutes les informations sur le véhicule
}



async addCroquiInfo(page: PDFPage, font: PDFFont,pdfDoc: PDFDocument, vehicleType: string, x: number, y: number) {
  const color = (vehicleType === 'A') ? this.convertRGB(253, 252, 232) : this.convertRGB(224, 251, 238);
  const xOffset = (vehicleType === 'A') ? -70 : 90;
  let currentY = y;  // Position de départ pour le véhicule
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

console.log("currentY addCroquiInfo : ",currentY)

  this.addStyledBox(page, `Dégats Apparents  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`degatsApparents${vehicleType}`], font, color);
  currentY -= 21
  this.addStyledBox(page, `Observations  : `, x + xOffset, currentY, 250, 30, this.accidentForm.value[`observations${vehicleType}`], font, color);

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
        width: 220,
        height: height,
        color: color,
        // borderWidth: 1,
        borderColor: rgb(0, 0, 0) // Ajout d'une bordure noire pour mieux visualiser
    });

    // Ajustement du texte pour éviter qu'il dépasse
    const text = `${label} ${value}`;
    const textWidth = font.widthOfTextAtSize(text, 10); // Calculer la largeur du texte avec une police réduite
    const maxTextWidth = 220 - 10; // Réduire pour ne pas toucher les bords du rectangle

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
  const vehicleBContainers = document.querySelectorAll('.vehiclesB-container .car-containerB, .vehiclesB-container .moto-containerB');

  async function captureAndDrawImage(container: HTMLElement, x: number, y: number) {
      const crosses = container.querySelectorAll('.cross');
      if (crosses.length === 0) {
          console.warn(`⚠️ Aucune croix trouvée dans ${container.className}, capture ignorée.`);
          return;
      }

      try {
          console.log(`📸 Capture en cours pour: ${container.className} avec ${crosses.length} croix.`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Augmenter le délai si nécessaire

          const canvas = await html2canvas(container, { backgroundColor: null });
          const imgData = canvas.toDataURL('image/png');

          // Ajout de l'image au PDF avec les coordonnées dynamiques
          const img = await pdfDoc.embedPng(imgData);
          const { width, height } = img.scale(0.5);

          // Ajouter l'image avec les coordonnées dynamiques
          page.drawImage(img, { x, y, width, height });
          console.log(`✅ Image ajoutée aux coordonnées x: ${x}, y: ${y}`);
      } catch (error) {
          console.error("❌ Erreur lors de la capture d'écran:", error);
      }
      
  }

  // Capture et ajout des images pour les containers A
  for (const container of Array.from(vehicleAContainers)) {
      await captureAndDrawImage(container as HTMLElement, 58, 24); // Coordonnées pour A
  }

  // Capture et ajout des images pour les containers B
  for (const container of Array.from(vehicleBContainers)) {
      await captureAndDrawImage(container as HTMLElement, 420, 24); // Coordonnées pour B
  }
}




 wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const words = text.split(' ');
  let lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
    if (width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine === '' ? '' : ' ') + word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

dateValidator(form: AbstractControl) {
  const date = new Date(form.get('date')?.value);
  const validFromA = new Date(form.get('validFromA')?.value);
  const validToA = new Date(form.get('validToA')?.value);
  const validFromB = new Date(form.get('validFromB')?.value);
  const validToB = new Date(form.get('validToB')?.value);

  if (!date || !validFromA || !validToA || !validFromB || !validToB) {
    return null; // Si une date est manquante, on ne fait pas la validation
  }

  const isValid =
    date >= validFromA && date <= validToA &&
    date >= validFromB && date <= validToB;

  return isValid ? null : { invalidDateRange: true };
}


onDragStart(event: CdkDragStart<any>) {
  console.log("Drag started:", event);

  this.draggedElement = event.source.data;
}


onDrop(event: CdkDragDrop<any>) {
  console.log("✅ onDrop déclenché !", event);

  if (!event.item || !event.item.data) {
    console.warn("⚠️ Aucune donnée trouvée dans l'élément drag & drop !");
    return;
  }

  const dropZone = document.querySelector('.elements-panel') as HTMLElement;
  const dropRect = dropZone.getBoundingClientRect();

  const draggedElement = event.item.element.nativeElement;
  const elementRect = draggedElement.getBoundingClientRect(); // Récupère les dimensions de l'image

  const mouseEvent = event.event as MouseEvent;
  const x = mouseEvent.clientX - dropRect.left - elementRect.width / 2;  
  const y = mouseEvent.clientY - dropRect.top - elementRect.height / 2;  

  const droppedData = event.item.data;

  // Vérifier si l'image existe déjà dans droppedElements
  const existingItemIndex = this.droppedElements.findIndex(el => el.name === droppedData.name);

  if (existingItemIndex !== -1) {
    // Mettre à jour les coordonnées en conservant la rotation
    this.droppedElements[existingItemIndex] = {
      ...this.droppedElements[existingItemIndex],
      x, 
      y,
    };
  } else {
    // Ajouter l'élément avec la position centrée
    this.droppedElements.push({
      ...droppedData,
      x, 
      y,
      rotation: droppedData.rotation ?? 0,
      position: 'absolute'
    });
  }

  console.log("📌 Éléments après ajout ou mise à jour :", this.droppedElements);
}

onDragMoved(event: CdkDragMove<any>) {
  const { x, y } = event.pointerPosition;
  this.dragPosition = { x, y };  // Mettez à jour la position en temps réel
  console.log('Déplacement en cours:', this.dragPosition);
}

onDragReleased(event: CdkDragRelease) {
  console.log('Élément relâché:', event);

  const draggedElement = event.source.element.nativeElement;
  const parentElement = draggedElement.parentElement;
  
  if (!parentElement) return;

  const parentRect = parentElement.getBoundingClientRect();
  const elementRect = draggedElement.getBoundingClientRect(); 

  const newX = elementRect.left - parentRect.left + elementRect.width / 2;
  const newY = elementRect.top - parentRect.top + elementRect.height / 2;

  const item = this.droppedElements.find(el => el === this.draggedElement);
  if (item) {
    item.x = newX;
    item.y = newY;
  }

  console.log("📌 Nouvelle position après relâchement :", { x: newX, y: newY });

  // Déclencher la détection des changements
  this.cdr.detectChanges();
}


rotateLeft(item: any) {
  console.log("Avant rotation"); // Log de l'état du formulaire avant la rotation

  item.rotation -= 90;  // Rotation de 90° à gauche

  console.log("Après rotation"); // Log de l'état du formulaire après la rotation
}


removeItem(item: any) {
  const index = this.droppedElements.indexOf(item);
  if (index > -1) {
    this.droppedElements.splice(index, 1);  // Suppression de l'élément de la zone de dépôt
  }
}

trackByFn(index: number, item: any): any {
  return item.id;  // Assurez-vous que chaque élément a un identifiant unique
}


async captureCroquiImage(page: PDFPage, pdfDoc: PDFDocument) {
  const Croqui = document.querySelectorAll('.elements-panel');

  async function captureAndDrawImage(container: HTMLElement, x: number, y: number) {
    try {
      console.log(`📸 Début de capture pour: ${container.className}`);

      // Capture de l'image avec html2canvas
      const canvas = await html2canvas(container, {
        scale: 1,
        backgroundColor: null,
        useCORS: true,
        logging: true
      });

      // Récupération des données de l'image en PNG
      const imgData = canvas.toDataURL('image/png', 1);
      const img = await pdfDoc.embedPng(imgData);

      // Largeur et Hauteur cibles
      const targetWidth = 225; // Largeur cible
      const targetHeight = 100; // Hauteur cible

      // Calcul des facteurs de mise à l'échelle pour largeur et hauteur
      const widthScale = targetWidth / img.width;
      const heightScale = targetHeight / img.height;

      // Appliquer les échelles respectives
      const width = img.width * widthScale;
      const height = img.height * heightScale;

      // Calculer la position X pour centrer l'image sur la page (600px est la largeur de la page)

      // Placer l'image sur la page, plus haut avec y ajusté
      page.drawImage(img, { 
        x: 190,  // Centrer horizontalement
        y: 70,       // Ajuster la position verticale (plus haut)
        width,
        height
      });

      
    } catch (error) {
      console.error("❌ Erreur détaillée lors de la capture:", error);
    }
  }

  // Capture et dessin de toutes les images des éléments trouvés
  for (const container of Array.from(Croqui)) {
    await captureAndDrawImage(container as HTMLElement, 10, 25);
  }
}


mapApiResponseToSinistre(data: any): Sinistre {
  return new Sinistre(
      data._id,
      data.date_survenance,
      data.date_declaration,
      data.num_police,
      data.objet_assure,
      data.description,
      data.status,
      data.reference,
      data.documents || null
  );
}

containsCommaValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value && !value.includes(',')) {
    return { missingComma: true };
  }
  return null;
}
  
get vehicleBrandB() {
  return this.accidentForm.get('vehicleBrandB');
}

get vehicleBrandA() {
  return this.accidentForm.get('vehicleBrandA');
}

}
