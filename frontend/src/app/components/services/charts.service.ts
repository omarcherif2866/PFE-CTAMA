import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChartsService {

 constructor(private http: HttpClient, private router: Router) { }


  getOrdreMissionStats(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9090/user/documents/ordre-mission-stats`);
  }

  // expert.service.ts
getExpertsGroupedByRegion(): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:9090/user/grouped-by-region`);
}

compterFournitures(): Observable<any> {
  return this.http.get<any>(`http://localhost:9090/user/compter-fournitures`);
}

}
