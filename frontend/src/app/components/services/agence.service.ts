import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Agence, Gouvernorat } from '../models/agence';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {
    private apiUrl = environment.apiUrl;

 constructor(private http: HttpClient, private router: Router) { }

  getAgenceById(id: any): Observable<Agence> {
    return this.http.get<Agence>(`${this.apiUrl}/agence/${id}`);
  } 

  getAgence() {
    return this.http.get<Agence[]>(`${this.apiUrl}/agence/`);
  }

  getAgenceByGouvernorat(gouvernorat: Gouvernorat): Observable<Agence[]>  {
    return this.http.get<Agence[]>(`${this.apiUrl}/agence/gouvernorat/${gouvernorat}`);
  }

  geocode(adresse: string): Observable<any[]> {
    const params = new HttpParams()
      .set('format', 'json')
      .set('q', adresse)
      .set('countrycodes', 'tn')
      .set('limit', '1');  // Limite à un seul résultat
  
    const url = 'https://nominatim.openstreetmap.org/search';
  
    console.log(`Requête de géocodage envoyée à: ${url}`);
    console.log(`Paramètres de la requête:`, params.toString());
  
    return this.http.get<any[]>(url, { params }).pipe(
      map(response => {
        console.log(`Réponse de géocodage reçue pour l'adresse "${adresse}":`, response);
        return response;
      }),
      catchError(error => {
        console.error('Erreur géocodage:', error);
        return of([]); // Retourner un tableau vide en cas d'erreur
      })
    );
  }
  


  addAgence(data: any): Observable<Agence> {
    return this.http.post<Agence>(`${this.apiUrl}/agence/`, data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Agence:', error);
          return throwError('Une erreur s\'est produite lors de l\'ajout du Agence. Veuillez réessayer.');
        })
      );
  }

  putAgence(id: string, formData: any): Observable<Agence> {
  return this.http.put<Agence | HttpErrorResponse>(`${this.apiUrl}/agence/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Agence;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Agence:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est produite lors de la mise à jour du Agence. Veuillez réessayer.');
      })
    );
}


  deleteAgence(id:any):Observable<Agence>{
   
    return this.http.delete<Agence>(`${this.apiUrl}/agence/${id}`)

  }

  getAgencesCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/agence/count`);
  }
}