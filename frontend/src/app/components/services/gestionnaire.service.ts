import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Emloyees } from '../models/emloyees';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionnaireService {
constructor(private http: HttpClient, private router: Router) { }

  getEmloyeesById(id: any): Observable<Emloyees> {
    return this.http.get<Emloyees>('http://localhost:9090/employees/' + id);
  } 

  getEmloyees(): Observable<Emloyees[]> {
    return this.http.get<Emloyees[]>("http://localhost:9090/employees/user/");
  }



  addEmloyees(data: any): Observable<Emloyees> {
    return this.http.post<Emloyees>("http://localhost:9090/employees/", data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Emloyees:', error);
          return throwError('Une erreur s\'est produite lors de l\'ajout du Emloyees. Veuillez réessayer.');
        })
      );
  }

  putEmloyees(id: string, formData: any): Observable<Emloyees> {
  return this.http.put<Emloyees | HttpErrorResponse>(`http://localhost:9090/employees/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Emloyees;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Emloyees:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est produite lors de la mise à jour du Emloyees. Veuillez réessayer.');
      })
    );
}


  deleteEmloyees(id:any):Observable<Emloyees>{
   
    return this.http.delete<Emloyees>("http://localhost:9090/employees/"+id)

  }
}