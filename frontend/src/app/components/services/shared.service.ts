import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private formData = new BehaviorSubject<any>(this.getFormDataFromLocalStorage());
  currentFormData = this.formData.asObservable();

  constructor() {}

  updateFormData(data: any) {
    console.log('Mise à jour des données dans SharedService:', data); // Journal de débogage
    this.formData.next(data);
    localStorage.setItem('formData', JSON.stringify(data)); // Enregistrer dans localStorage
    console.log('Données enregistrées dans localStorage:', localStorage.getItem('formData')); // Vérifier les données stockées
  }

  getFormDataFromLocalStorage(): any {
    const data = localStorage.getItem('formData');
    console.log('Données récupérées depuis localStorage:', data); // Journal de débogage
    return data ? JSON.parse(data) : null;
  }
}
