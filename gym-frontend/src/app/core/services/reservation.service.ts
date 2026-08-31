import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReservationRequest, ReservationResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private url = `${environment.apiUrl}/reservations`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<ReservationResponse[]>                               { return this.http.get<ReservationResponse[]>(this.url); }
  findByMembre(id: number): Observable<ReservationResponse[]>                { return this.http.get<ReservationResponse[]>(`${this.url}/membre/${id}`); }
  findBySeance(id: number): Observable<ReservationResponse[]>                { return this.http.get<ReservationResponse[]>(`${this.url}/seance/${id}`); }
  reserver(data: ReservationRequest): Observable<ReservationResponse>        { return this.http.post<ReservationResponse>(this.url, data); }
  annuler(id: number, motif?: string): Observable<ReservationResponse>       { return this.http.patch<ReservationResponse>(`${this.url}/${id}/annuler?motif=${motif || ''}`, {}); }
}