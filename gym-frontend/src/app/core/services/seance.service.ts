import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SeanceRequest, SeanceResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class SeanceService {
  private url = `${environment.apiUrl}/seances`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<SeanceResponse[]>                                { return this.http.get<SeanceResponse[]>(this.url); }
  findDisponibles(): Observable<SeanceResponse[]>                        { return this.http.get<SeanceResponse[]>(`${this.url}/disponibles`); }
  findById(id: number): Observable<SeanceResponse>                       { return this.http.get<SeanceResponse>(`${this.url}/${id}`); }
  create(data: SeanceRequest): Observable<SeanceResponse>                { return this.http.post<SeanceResponse>(this.url, data); }
  update(id: number, data: SeanceRequest): Observable<SeanceResponse>    { return this.http.put<SeanceResponse>(`${this.url}/${id}`, data); }
  delete(id: number): Observable<void>                                   { return this.http.delete<void>(`${this.url}/${id}`); }
}