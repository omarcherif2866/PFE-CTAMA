import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Expert } from '../models/expert';
import { ImageSinistre } from '../models/image-sinistre';
import { DevisSinistre } from '../models/devis-sinistre';

@Injectable({
  providedIn: 'root'
})
export class ExpertService {
 constructor(private http: HttpClient, private router: Router) { }

  getExpertById(id: any): Observable<Expert> {
    return this.http.get<Expert>('http://localhost:9090/expert/' + id);
  } 

  getExpert(): Observable<Expert[]> {
    return this.http.get<Expert[]>("http://localhost:9090/expert/user/");
  }



  addExpert(data: any): Observable<Expert> {
    return this.http.post<Expert>("http://localhost:9090/expert/", data)
      .pipe(
        catchError((error: any) => {
          console.error('Erreur lors de l\'ajout du Expert:', error);
          return throwError('Une erreur s\'est produite lors de l\'ajout du Expert. Veuillez réessayer.');
        })
      );
  }

  putExpert(id: string, formData: any): Observable<Expert> {
  return this.http.put<Expert | HttpErrorResponse>(`http://localhost:9090/expert/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Expert;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Expert:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est produite lors de la mise à jour du Expert. Veuillez réessayer.');
      })
    );
}


  deleteExpert(id:any):Observable<Expert>{
   
    return this.http.delete<Expert>("http://localhost:9090/expert/"+id)

  }

  affecterExpert(expertId: string, clientId: string, documentId: string): Observable<any> {
    const url = `http://localhost:9090/expert/affecter-expert`; // Endpoint de l'API
    const body = {
      expertId: expertId,
      clientId: clientId,
      documentId: documentId
    };

    return this.http.post<any>(url, body);
  }

  addImageSinistre(formData: FormData) {
    return this.http.post(`http://localhost:9090/expert/add`, formData);
  }
  



  // Récupérer les images par expert
  getImagesByExpert(expertId: string): Observable<ImageSinistre[]> {
    return this.http.get<any[]>(`http://localhost:9090/expert/image/${expertId}`).pipe(
      map(response => response.map(data => 
        new ImageSinistre(data.image,data.imageAfterAccident, data.expert, data.client, data.dateAjout, data.documents, data._id)
      ))
      
          );
  }




  
  getDevisByExpert(expertId: string): Observable<DevisSinistre[]> {
    return this.http.get<any[]>(`http://localhost:9090/expert/devis/${expertId}`).pipe(
      map(response => response.map(data => 
        new DevisSinistre(data.devis, data.expert, data.client, data.dateAjout, data.documents, data._id)
      ))
      
          );
  }

  // Supprimer une image
  deleteImage(imageId: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:9090/expert/delete/${imageId}`);
  }
  

  getExpertsCount(): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/expert/count`);
  }


  ajouterImageAfterAccident(id: string, formData: FormData): Observable<any> {
    return this.http.post(`http://localhost:9090/expert/ajouter-image-after-accident/${id}`, formData);
  }


  generateOrdeMission(id: string): Observable<Blob> {
    return this.http.get(`http://localhost:9090/pdf/generate-pdf/${id}`, { 
      responseType: 'blob',
      observe: 'response'  // Ceci vous permet d'accéder aux headers si nécessaire
    }).pipe(
      map(response => response.body as Blob)
    );
  }


  envoyerRapport(formData: any): Observable<Blob> {
    // Utilisation de 'responseType' : 'blob' pour récupérer le PDF en tant que Blob
    return this.http.post<Blob>('http://localhost:9090/pdf/', formData, {
      responseType: 'blob' as 'json'  // Cas spécifique de Angular où vous devez caster en 'json'
    });
  }

  uploadImages(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:9090/pdf/upload', formData);
  }

  getAllRapports(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:9090/pdf',);
  }

  // Obtenir les rapports d'un expert
  getRapportsByExpert(expertId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9090/pdf/expert/${expertId}`);
  }


  

}