import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EquipementRequest, EquipementResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class EquipementService {
  private url = `${environment.apiUrl}/equipements`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<EquipementResponse[]>                                    { return this.http.get<EquipementResponse[]>(this.url); }
  findById(id: number): Observable<EquipementResponse>                           { return this.http.get<EquipementResponse>(`${this.url}/${id}`); }
  create(data: EquipementRequest): Observable<EquipementResponse>                { return this.http.post<EquipementResponse>(this.url, data); }
  update(id: number, data: EquipementRequest): Observable<EquipementResponse>    { return this.http.put<EquipementResponse>(`${this.url}/${id}`, data); }
  delete(id: number): Observable<void>                                           { return this.http.delete<void>(`${this.url}/${id}`); }
}