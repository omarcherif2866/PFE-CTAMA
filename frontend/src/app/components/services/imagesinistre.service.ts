import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  Observable } from 'rxjs';
import { ImageSinistre } from '../models/image-sinistre';
@Injectable({
  providedIn: 'root'
})
export class ImagesinistreService {

  constructor(private http: HttpClient, private router: Router) { }

  getImagesSinistres(): Observable<ImageSinistre[]> {
    return this.http.get<ImageSinistre[]>("http://localhost:9090/imagessinistre");
  }
}
