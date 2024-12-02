import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Etudiant } from '../model/etudiant';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  private baseUrl = 'http://localhost:9099/cours';

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer la liste des étudiants d'un cours donné
  getEtudiantsByCourId(courId: number): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.baseUrl}/${courId}/etudiants`);
  }
  getDevoirsrenduWithCommentsAndNotes(idCours: number,idEtudiant: number): Observable<any[]> {
    const url = `${this.baseUrl}/${idCours}/etudiant/${idEtudiant}`;
    return this.http.get<any[]>(url);
  }
}
