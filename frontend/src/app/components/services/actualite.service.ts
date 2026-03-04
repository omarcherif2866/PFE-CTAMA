import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Actualite } from '../models/actualite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActualiteService {
    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  getActualiteById(id: any): Observable<Actualite> {
    return this.http.get<Actualite>(`${this.apiUrl}/Actualite/${id}`);
  } 

// actualite.service.ts
getActualite(): Observable<Actualite[]> {
  return this.http.get<any[]>(`${this.apiUrl}/Actualite/`).pipe(
    map(actualites => actualites.map(act => new Actualite(
      act._id,       // Assurez-vous que c'est le bon nom de la propriété ID de votre API
      act.nom,
      act.description,
      act.image
    )))
  );
}

  getLastThreeActualites(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Actualite/lastThree`);
  }


  addActualite(data: any): Observable<Actualite> {
    return this.http.post<Actualite>(`${this.apiUrl}/Actualite`, data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Actualite:', error);
          return throwError('Une erreur s\'est Actualitee lors de l\'ajout du Actualite. Veuillez réessayer.');
        })
      );
  }

  putActualite(id: string, formData: any): Observable<Actualite> {
  return this.http.put<Actualite | HttpErrorResponse>(`${this.apiUrl}/Actualite/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Actualite;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Actualite:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est Actualitee lors de la mise à jour du Actualite. Veuillez réessayer.');
      })
    );
}


  deleteActualite(id:any):Observable<Actualite>{
    console.log('deleteActualite called with id:', id);
    return this.http.delete<Actualite>(`${this.apiUrl}/Actualite/${id}`)

  }

}