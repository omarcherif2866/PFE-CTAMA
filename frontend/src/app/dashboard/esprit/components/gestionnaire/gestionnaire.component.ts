import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Emloyees } from 'src/app/components/models/emloyees';
import { GestionnaireService } from 'src/app/components/services/gestionnaire.service';

@Component({
  selector: 'app-gestionnaire',
  templateUrl: './gestionnaire.component.html',
  styleUrl: './gestionnaire.component.scss'
})
export class GestionnaireComponent {
  employeeForm!: FormGroup;
  employeeDialog: boolean = false;
  deleteEmployeeDialog: boolean = false;
  employees: Emloyees[] = [];
  employee!: Emloyees ;
  uploadedFiles: File[] = [];
  actionLabel: string = 'Enregistrer';
  submitted: boolean = false;
  cols!: any[];
  selectedEmloyees: Emloyees[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: GestionnaireService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getAllEmloyeess();
  }
  
  initForm() {
    this.employeeForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],  // Ajout du prénom
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')  
      ]],
      phoneNumber: ['', Validators.required],
      poste: ['', Validators.required],  // Ajout de la région
      departement: ['', Validators.required],  // Ajout du taux avec validation
      image: [null],
    });
  }
  
  
  

  openNew() {
    this.employee = new Emloyees('', '', '', '', '', '','', '', '');
    this.employeeForm.reset();
    this.employeeDialog = true;
  }

  editEmloyees(employee: any) {
    const employeeInstance = new Emloyees(
      employee._id,
      employee.email,
      employee.image,
      employee.phoneNumber,
      employee.poste,
      employee.departement,
      employee.nom,
      employee.prenom,
      '',
      

    );
    if (employeeInstance && employeeInstance.Id) {
      this.employeeDialog = true;
      this.employee = employeeInstance;
    }    

      this.employeeForm.patchValue({
      nom: employee.nom,
      prenom: employee.prenom,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      poste: employee.poste,
      departement: employee.departement,
      password: '', // Optionnel : laisser vide
    });

    this.actionLabel = 'Modifier';
  }
  

  deleteEmloyees(employee: any) {
    const employeeInstance = new Emloyees(
      employee._id,
      employee.email,
      employee.image,
      employee.phoneNumber,
      employee.poste,
      employee.departement,
      employee.nom,
      employee.prenom,
      '',

    );
    if (employeeInstance && employeeInstance.Id) {
      this.deleteEmployeeDialog = true;
      this.employee = employeeInstance;
    } else {
      console.error('employee object is missing ID:', employeeInstance);
    }
  }

  confirmDelete() {
    if (this.employee && this.employee.Id) {
      this.employeeService.deleteEmloyees(this.employee.Id).subscribe(
        response => {
          this.employees = this.employees.filter(val => val.Id !== this.employee.Id);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Emloyees supprimé', life: 3000 });
          this.employee = new Emloyees('', '', '', '', '', '', '', '', '', );
          this.deleteEmployeeDialog = false;
          window.location.reload();
        },
        error => {
          console.error('Erreur lors de la suppression du employee:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression du employee', life: 3000 });
          this.deleteEmployeeDialog = false;
        }
      );
    } else {
      console.error('ID de employee invalide:', this.employee);
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'ID de employee invalide', life: 3000 });
      this.deleteEmployeeDialog = false;
    }
  }

  hideDialog() {
    this.employeeDialog = false;
    this.submitted = false;
  }

  onFileSelected(event: any): void {
    if (event.files && event.files.length > 0) {
      this.uploadedFiles = [];
      for (let file of event.files) {
        this.uploadedFiles.push(file);
      }
    } else {
      console.error("Erreur lors de la sélection du fichier : la propriété 'files' n'est pas définie dans l'événement.");
    }
  }

  getImageUrl(imageName: string): string {
    return `${imageName}`;
  }

  saveEmloyees() {
    this.submitted = true;
  
    // Vérifier si le formulaire est valide
    if (this.employeeForm.invalid) {
      return;
    }
  
    // Créer un objet FormData pour envoyer les données
    const employeeData = new FormData();
  
    // Ajouter les propriétés de base
    employeeData.append('nom', this.employeeForm.get('nom')!.value);
    employeeData.append('prenom', this.employeeForm.get('prenom')!.value);
    employeeData.append('email', this.employeeForm.get('email')!.value);
    employeeData.append('password', this.employeeForm.get('password')!.value);
    employeeData.append('phoneNumber', this.employeeForm.get('phoneNumber')!.value);
    employeeData.append('poste', this.employeeForm.get('poste')!.value);
    employeeData.append('departement', this.employeeForm.get('departement')!.value);
  
    // Ajouter l'image si elle est sélectionnée
    if (this.uploadedFiles && this.uploadedFiles.length > 0) {
      employeeData.append('image', this.uploadedFiles[0]);
    }
  
    // Appeler le service pour ajouter l'employee
    this.employeeService.addEmloyees(employeeData).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Emloyees ajouté avec succès' });
        this.employeeDialog = false; // Fermer le dialogue
        this.employeeForm.reset(); // Réinitialiser le formulaire
        window.location.reload(); // Recharger la page
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'ajout de l\'employee' });
      }
    );
  }
  
  getAllEmloyeess(): void {
    this.employeeService.getEmloyees().subscribe(
      employees => {
        this.employees = employees;
      },
      error => {
        console.error('Erreur lors de la récupération des employees:', error);
      }
    );
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
