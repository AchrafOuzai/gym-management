import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlanRequest, PlanResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private url = `${environment.apiUrl}/plans`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<PlanResponse[]>                          { return this.http.get<PlanResponse[]>(`${this.url}/all`); }
  findActifs(): Observable<PlanResponse[]>                       { return this.http.get<PlanResponse[]>(this.url); }
  findById(id: number): Observable<PlanResponse>                 { return this.http.get<PlanResponse>(`${this.url}/${id}`); }
  create(data: PlanRequest): Observable<PlanResponse>            { return this.http.post<PlanResponse>(this.url, data); }
  update(id: number, data: PlanRequest): Observable<PlanResponse> { return this.http.put<PlanResponse>(`${this.url}/${id}`, data); }
  delete(id: number): Observable<void>                           { return this.http.delete<void>(`${this.url}/${id}`); }
}