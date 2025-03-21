import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Voiture } from '../models/voiture';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {
 constructor(private http: HttpClient, private router: Router) { }

  getVoitureById(id: any): Observable<Voiture> {
    return this.http.get<Voiture>('http://localhost:9090/voiture/' + id);
  } 

  getVoiture() {
    return this.http.get<Voiture[]>("http://localhost:9090/voiture/");
  }



  addVoiture(data: any): Observable<Voiture> {
    return this.http.post<Voiture>("http://localhost:9090/voiture/", data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Voiture:', error);
          return throwError('Une erreur s\'est produite lors de l\'ajout du Voiture. Veuillez réessayer.');
        })
      );
  }

  putVoiture(id: string, formData: any): Observable<Voiture> {
  return this.http.put<Voiture | HttpErrorResponse>(`http://localhost:9090/voiture/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Voiture;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Voiture:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est produite lors de la mise à jour du Voiture. Veuillez réessayer.');
      })
    );
}


  deleteVoiture(id:any):Observable<Voiture>{
   
    return this.http.delete<Voiture>("http://localhost:9090/voiture/"+id)

  }
}