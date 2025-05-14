import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  Observable } from 'rxjs';
import { DevisSinistre } from '../models/devis-sinistre';

@Injectable({
  providedIn: 'root'
})
export class DevissinistreService {

  constructor(private http: HttpClient, private router: Router) { }

  getDevisSinistres(): Observable<DevisSinistre[]> {
    return this.http.get<DevisSinistre[]>("http://localhost:9090/devissinistre");
  }

}
