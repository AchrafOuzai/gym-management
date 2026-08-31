import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProgrammeRequest, ProgrammeResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ProgrammeService {
  private url = `${environment.apiUrl}/programmes`;
  constructor(private http: HttpClient) {}

  findByMembre(id: number): Observable<ProgrammeResponse[]>                          { return this.http.get<ProgrammeResponse[]>(`${this.url}/membre/${id}`); }
  findByCoach(id: number): Observable<ProgrammeResponse[]>                           { return this.http.get<ProgrammeResponse[]>(`${this.url}/coach/${id}`); }
  findById(id: number): Observable<ProgrammeResponse>                                { return this.http.get<ProgrammeResponse>(`${this.url}/${id}`); }
  create(data: ProgrammeRequest): Observable<ProgrammeResponse>                      { return this.http.post<ProgrammeResponse>(this.url, data); }
  update(id: number, data: ProgrammeRequest): Observable<ProgrammeResponse>          { return this.http.put<ProgrammeResponse>(`${this.url}/${id}`, data); }
  delete(id: number): Observable<void>                                               { return this.http.delete<void>(`${this.url}/${id}`); }
}