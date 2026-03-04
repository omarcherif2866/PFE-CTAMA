import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  Observable } from 'rxjs';
import { ImageSinistre } from '../models/image-sinistre';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagesinistreService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  getImagesSinistres(): Observable<ImageSinistre[]> {
    return this.http.get<ImageSinistre[]>(`${this.apiUrl}/imagessinistre`);
  }
}
