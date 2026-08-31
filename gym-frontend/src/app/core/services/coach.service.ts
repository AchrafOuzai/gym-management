import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CoachRequest, CoachResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class CoachService {
  private url = `${environment.apiUrl}/coachs`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<CoachResponse[]>                         { return this.http.get<CoachResponse[]>(this.url); }
  findActifs(): Observable<CoachResponse[]>                      { return this.http.get<CoachResponse[]>(`${this.url}/actifs`); }
  findById(id: number): Observable<CoachResponse>                { return this.http.get<CoachResponse>(`${this.url}/${id}`); }
  create(data: CoachRequest): Observable<CoachResponse>          { return this.http.post<CoachResponse>(this.url, data); }
  update(id: number, data: CoachRequest): Observable<CoachResponse> { return this.http.put<CoachResponse>(`${this.url}/${id}`, data); }
  desactiver(id: number): Observable<void>                       { return this.http.patch<void>(`${this.url}/${id}/desactiver`, {}); }
  delete(id: number): Observable<void>                           { return this.http.delete<void>(`${this.url}/${id}`); }
}