import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Clients } from '../../models/clients';
import { ImageSinistre } from '../../models/image-sinistre';
import { DevisSinistre } from '../../models/devis-sinistre';

const AUTH_API = 'http://localhost:8075/api/v1/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    // Initialisez le BehaviorSubject à false ou à la valeur stockée dans localStorage
    const storedLoggedIn = localStorage.getItem('loggedIn');
    this.loggedInSubject = new BehaviorSubject<boolean>(storedLoggedIn ? JSON.parse(storedLoggedIn) : false);

  }




  createAcount(data:any){
    return this.http.post<Clients>("http://localhost:9090/clients/signup",data)
  }

  getUser() {
    return this.http.get<Clients[]>("http://localhost:9090/clients/user");
  }

  getUserProfile(id: any): Observable<Clients> {
    return this.http.get<Clients>(`http://localhost:9090/clients/user/${id}`);
}

  updateUserPassword(id: any, motdepasse: string, newPassword: string): Observable<any> {
    const data = {
      password: motdepasse,
      newpassword: newPassword
    };
  
    return this.http.put<any>(`http://localhost:9090/clients/api/user/password/${id}`, data);
  }



  signIn(credentials: any): Observable<any> {
    return this.http.post<any>("http://localhost:9090/clients/signin", credentials).pipe(
      tap((user: any) => {
        console.log('User data:', user);
        
        // Determine userRole based on flags
        let userRole;
        if (user.isEmployee && user.poste === 'admin') {
          userRole = 'admin';
        } else if (user.isExpert) {
          userRole = 'expert';
        } else {
          // Use user.typeClient directly
          userRole = user.typeClient || 'PersonnePhysique';
        }
        
        // Update local storage
        this.setLoggedIn(true);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('user_email', user.email);
        localStorage.setItem('user_id', user._id);
      }),
      catchError(this.handleError)
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable(); // Retournez le BehaviorSubject en tant qu'Observable
  }

  setLoggedIn(status: boolean) {
    this.loggedInSubject.next(status); // Mettez à jour l'état de connexion avec le BehaviorSubject
    // Stockez également l'état de connexion dans le localStorage
    localStorage.setItem('loggedIn', JSON.stringify(status));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong'; // Default error message
  
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Mot de passe incorrect. Veuillez vérifier votre mot de passe et réessayer.';
          break;
        case 404:
          errorMessage = 'Adresse email incorrecte. L\'adresse email que vous avez saisie est incorrecte ou n\'existe pas.';
          break;
        default:
          errorMessage = `Erreur code ${error.status}: ${error.message}`;
          break;
      }
    }
  

  
    // Throw the error so that the observable chain can be properly handled
    return throwError(() => new Error(errorMessage));
  }
  

  logout(): void {
    this.setLoggedIn(false); // Définissez loggedIn sur false
    localStorage.removeItem('loggedIn'); // Supprimez l'état de connexion du localStorage
    localStorage.removeItem('user_id'); // Supprimez l'ID de l'utilisateur du localStorage
    localStorage.removeItem('userRole'); // Supprimez l'ID de l'utilisateur du localStorage
    localStorage.removeItem('user_email'); // Supprimez l'ID de l'utilisateur du localStorage

  }

  updateUserProfile(id: string, formData: FormData ): Observable<Clients> {
    return this.http.put<Clients>(`http://localhost:9090/clients/user/profile/${id}`, formData);
  }



  deleteUser(id:any):Observable<Clients>{
    return this.http.delete<Clients>("http://localhost:9090/clients/user/delete/"+id)

  }


  forget(email: string): Observable<any> {
    const credentials = { email };
    return this.http.post<any>('http://localhost:9090/clients/user/forgotPassword', credentials);
  }

  resetPassword(userId: string, password: string): Observable<any> {
    return this.http.put<any>(`http://localhost:9090/clients/api/user/password/${userId}`, { password });
  }


  getClientsCount(): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/clients/count`);
  }

  addDevisSinistre(formData: FormData) {
    return this.http.post(`http://localhost:9090/clients/deposerDevis`, formData);
  }

    getImagesByClient(clientId: string): Observable<ImageSinistre[]> {
      return this.http.get<any[]>(`http://localhost:9090/clients/image/${clientId}`).pipe(
        map(response => response.map(data => 
          new ImageSinistre(data.image, data.expert, data.client, data.dateAjout, data.documents, data._id)
        ))
        
            );
    }
  
    getDevisByClient(clientId: string): Observable<DevisSinistre[]> {
      return this.http.get<any[]>(`http://localhost:9090/clients/devis/${clientId}`).pipe(
        map(response => response.map(data => 
          new DevisSinistre(data.devis, data.expert, data.client, data.dateAjout, data.documents, data._id)
        ))
        
            );
    }
  
}
