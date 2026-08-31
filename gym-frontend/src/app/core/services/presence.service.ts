import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PresenceRequest, PresenceResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PresenceService {
  private url = `${environment.apiUrl}/presences`;
  constructor(private http: HttpClient) {}

  findBySeance(id: number): Observable<PresenceResponse[]>                   { return this.http.get<PresenceResponse[]>(`${this.url}/seance/${id}`); }
  findByMembre(id: number): Observable<PresenceResponse[]>                   { return this.http.get<PresenceResponse[]>(`${this.url}/membre/${id}`); }
  enregistrer(data: PresenceRequest): Observable<PresenceResponse>           { return this.http.post<PresenceResponse>(this.url, data); }
  delete(id: number): Observable<void>                                       { return this.http.delete<void>(`${this.url}/${id}`); }
}