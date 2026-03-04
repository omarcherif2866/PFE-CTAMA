import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  Observable } from 'rxjs';
import { DevisSinistre } from '../models/devis-sinistre';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevissinistreService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  getDevisSinistres(): Observable<DevisSinistre[]> {
    return this.http.get<DevisSinistre[]>(`${this.apiUrl}/devissinistre`);
  }

}
