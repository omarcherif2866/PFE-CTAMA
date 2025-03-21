import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Sinistre } from '../models/sinistre';

@Injectable({
  providedIn: 'root'
})
export class SinistreService {
 constructor(private http: HttpClient, private router: Router) { }

  addSinistre(data: any): Observable<Sinistre> {
    return this.http.post<Sinistre>("http://localhost:9090/sinistre/", data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Sinistre:', error);
          return throwError('Une erreur s\'est produite lors de l\'ajout du Sinistre. Veuillez réessayer.');
        })
      );
  }

getAllSinistre() {
    return this.http.get<Sinistre[]>("http://localhost:9090/sinistre/");
  }



  updateDocStatus(documentId: string, status: string): Observable<Sinistre> {
    const url = `http://localhost:9090/sinistre/status/${documentId}`;
    return this.http.put<Sinistre>(url, { status });
  }

  
  deleteSinistre(id:any):Observable<Sinistre>{
    return this.http.delete<Sinistre>("http://localhost:9090/sinistre/"+id)
  }

  putSinistre(reference: string, formData: any): Observable<Sinistre> {
    console.log('Référence envoyée au backend:', reference);
    return this.http.put<Sinistre | HttpErrorResponse>("http://localhost:9090/sinistre/" + reference, formData)
      .pipe(
        map((response: any) => {
          if (response instanceof HttpErrorResponse) {
            throw response;
          } else {
            return response as Sinistre;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour du Sinistre:', error);
          return throwError('Une erreur s\'est produite lors de la mise à jour du Sinistre. Veuillez réessayer.');
        })
      );
  }
  

  getSinistreByReference(reference: string): Observable<any> {
    return this.http.get(`http://localhost:9090/sinistre/reference/${reference}`);
  }

  getSinistreByDocument(documentId: string): Observable<Sinistre> {
    return this.http.get<Sinistre>(`http://localhost:9090/sinistre/document/${documentId}`);
  }

}
