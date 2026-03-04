import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  private apiUrl = environment.apiUrl;

 constructor(private http: HttpClient, private router: Router) { }


  getOrdreMissionStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/documents/ordre-mission-stats`);
  }

  // expert.service.ts
getExpertsGroupedByRegion(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/user/grouped-by-region`);
}

getDocumentsGroupedByGouvernorat(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/user/sinistre-grouped-by-gouvernorat`);
}

compterFournitures(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/user/compter-fournitures`);
}

}
