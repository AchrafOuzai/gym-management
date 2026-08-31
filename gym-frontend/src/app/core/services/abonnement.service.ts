import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AbonnementRequest, AbonnementResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AbonnementService {
  private url = `${environment.apiUrl}/abonnements`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<AbonnementResponse[]>                            { return this.http.get<AbonnementResponse[]>(this.url); }
  findByMembre(membreId: number): Observable<AbonnementResponse[]>       { return this.http.get<AbonnementResponse[]>(`${this.url}/membre/${membreId}`); }
  findById(id: number): Observable<AbonnementResponse>                   { return this.http.get<AbonnementResponse>(`${this.url}/${id}`); }
  create(data: AbonnementRequest): Observable<AbonnementResponse>        { return this.http.post<AbonnementResponse>(this.url, data); }
  delete(id: number): Observable<void>                                   { return this.http.delete<void>(`${this.url}/${id}`); }
}