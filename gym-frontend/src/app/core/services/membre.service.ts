import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MembreRequest, MembreResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class MembreService {
  private url = `${environment.apiUrl}/membres`;
  constructor(private http: HttpClient) {}

  findAll(): Observable<MembreResponse[]>                        { return this.http.get<MembreResponse[]>(this.url); }
  findById(id: number): Observable<MembreResponse>               { return this.http.get<MembreResponse>(`${this.url}/${id}`); }
  search(keyword: string): Observable<MembreResponse[]>          { return this.http.get<MembreResponse[]>(`${this.url}/search?keyword=${keyword}`); }
  create(data: MembreRequest): Observable<MembreResponse>        { return this.http.post<MembreResponse>(this.url, data); }
  update(id: number, data: MembreRequest): Observable<MembreResponse> { return this.http.put<MembreResponse>(`${this.url}/${id}`, data); }
  delete(id: number): Observable<void>                           { return this.http.delete<void>(`${this.url}/${id}`); }
}