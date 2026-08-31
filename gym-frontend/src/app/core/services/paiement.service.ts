import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaiementRequest, PaiementResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PaiementService {
  private url = `${environment.apiUrl}/paiements`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<PaiementResponse[]>                          { return this.http.get<PaiementResponse[]>(this.url); }
  findByMembre(id: number): Observable<PaiementResponse[]>           { return this.http.get<PaiementResponse[]>(`${this.url}/membre/${id}`); }
  findEnRetard(): Observable<PaiementResponse[]>                     { return this.http.get<PaiementResponse[]>(`${this.url}/en-retard`); }
  create(data: PaiementRequest): Observable<PaiementResponse>        { return this.http.post<PaiementResponse>(this.url, data); }
  marquerPaye(id: number, methode?: string): Observable<PaiementResponse> {
    return this.http.patch<PaiementResponse>(`${this.url}/${id}/payer?methode=${methode || 'ESPECES'}`, {});
  }
  delete(id: number): Observable<void>                               { return this.http.delete<void>(`${this.url}/${id}`); }
}