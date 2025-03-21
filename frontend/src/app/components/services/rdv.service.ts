import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RDV } from '../models/rdv';

@Injectable({
  providedIn: 'root'
})
export class RDVService {

  constructor(private http: HttpClient, private router: Router) { }

  getRDVById(id: any): Observable<RDV> {
    return this.http.get<RDV>('http://localhost:9090/rendez-vous/' + id);
  } 

  getRDV() {
    return this.http.get<RDV[]>("http://localhost:9090/rendez-vous/");
  }

  addRDV(ownedBy: string, data: any): Observable<HttpResponse<RDV>> {
    const url = `http://localhost:9090/rendez-vous/addRDV/${ownedBy}`;
    
    return this.http.post<RDV>(url, data, {
      observe: 'response' // Observe the full response
    }).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du RDV:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du RDV. Veuillez réessayer.');
      })
    );
  }

  putRDV(id: string, formData: any): Observable<RDV> {
    return this.http.put<RDV | HttpErrorResponse>(`http://localhost:9090/rendez-vous/${id}`, formData)
      .pipe(
        map((response: any) => {
          // Vérifier si la réponse est une instance de HttpErrorResponse
          if (response instanceof HttpErrorResponse) {
            // Si c'est une erreur HTTP, propager l'erreur
            throw response;
          } else {
            // Sinon, retourner la réponse comme une instance d'Activite
            return response as RDV;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          // Traiter les erreurs HTTP ici
          console.error('Erreur lors de la mise à jour du Product:', error);
          // Retourner une erreur observable
          return throwError('Une erreur s\'est produite lors de la mise à jour du Product. Veuillez réessayer.');
        })
      );
  }

  deleteRDV(id:any):Observable<RDV>{
    console.log('deleteProduct called with id:', id);
    return this.http.delete<RDV>("http://localhost:9090/rendez-vous/"+id)

  }

  getRDVsByCriteria(): Observable<RDV[]> {
    const ownedBy = localStorage.getItem('user_id') || '';
    const withUser = localStorage.getItem('user_id') || '';

    // Construct the URL with query parameters
    const url = `http://localhost:9090/rendez-vous/filter?ownedBy=${encodeURIComponent(ownedBy)}&receiver=${encodeURIComponent(withUser)}`;

    return this.http.get<RDV[]>(url);
  }
}