import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Documents } from '../models/documents';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
 constructor(private http: HttpClient, private router: Router) { }

createDocument(document: FormData): Observable<any> {
  return this.http.post(`http://localhost:9090/documents/deposerDoc`, document);
}

getAllDocuments() {
    return this.http.get<Documents[]>("http://localhost:9090/documents/");
  }

  getDocumentsByClient(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9090/documents/client/${clientId}`);
  }

  updateDocStatus(documentId: string, status: string): Observable<Documents> {
    const url = `http://localhost:9090/documents/status/${documentId}`;
    return this.http.put<Documents>(url, { status });
  }

  getDocById(id: any): Observable<Documents> {
    return this.http.get<Documents>('http://localhost:9090/documents/' + id);
  } 

    getDocumentsCount(): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/documents/count`);
  }
}