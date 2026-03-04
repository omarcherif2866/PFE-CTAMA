import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Documents } from '../models/documents';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
    private apiUrl = environment.apiUrl;

 constructor(private http: HttpClient, private router: Router) { }

createDocument(document: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/documents/deposerDoc`, document);
}

getAllDocuments() {
    return this.http.get<Documents[]>(`${this.apiUrl}/documents/`);
  }

  getDocumentsByClient(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents/client/${clientId}`);
  }

  updateDocStatus(documentId: string, status: string): Observable<Documents> {
    const url = `${this.apiUrl}/documents/status/${documentId}`;
    return this.http.put<Documents>(url, { status });
  }

  getDocById(id: any): Observable<Documents> {
    return this.http.get<Documents>(`${this.apiUrl}/documents/${id}`);
  } 

    getDocumentsCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/documents/count`);
  }
}