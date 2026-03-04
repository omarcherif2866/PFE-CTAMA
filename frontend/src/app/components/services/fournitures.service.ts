import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Fournitures } from '../models/fournitures';
import { FournitureEval } from '../models/fourniture-eval';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FournituresService {
    private apiUrl = environment.apiUrl;

 constructor(private http: HttpClient, private router: Router) { }

  getFournituresById(id: any): Observable<Fournitures> {
    return this.http.get<Fournitures>(`${this.apiUrl}/fourniture/${id}`);
  } 

  getFournitures() {
    return this.http.get<Fournitures[]>(`${this.apiUrl}/fourniture/`);
  }



  addFournitures(data: any): Observable<Fournitures> {
    return this.http.post<Fournitures>(`${this.apiUrl}/fourniture/`, data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Fournitures:', error);
          return throwError('Une erreur s\'est produite lors de l\'ajout du Fournitures. Veuillez réessayer.');
        })
      );
  }

  putFournitures(id: string, formData: any): Observable<Fournitures> {
  return this.http.put<Fournitures | HttpErrorResponse>(`${this.apiUrl}/fourniture/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Fournitures;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Fournitures:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est produite lors de la mise à jour du Fournitures. Veuillez réessayer.');
      })
    );
}


  deleteFournitures(id:any):Observable<Fournitures>{
   
    return this.http.delete<Fournitures>(`${this.apiUrl}/fourniture/${id}`)

  }



  getFournituresEval() {
    return this.http.get<FournitureEval[]>(`${this.apiUrl}/fournitureEval/`);
  }



  addFournituresEval(data: any): Observable<FournitureEval> {
    return this.http.post<FournitureEval>(`${this.apiUrl}/fournitureEval/`, data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Fournitures:', error);
          return throwError('Une erreur s\'est produite lors de l\'ajout du Fournitures. Veuillez réessayer.');
        })
      );
  }
}