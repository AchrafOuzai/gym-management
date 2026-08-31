import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private url = `${environment.apiUrl}/notifications`;
  constructor(private http: HttpClient) {}

  findByMembre(id: number): Observable<NotificationResponse[]>   { return this.http.get<NotificationResponse[]>(`${this.url}/membre/${id}`); }
  findNonLues(id: number): Observable<NotificationResponse[]>    { return this.http.get<NotificationResponse[]>(`${this.url}/membre/${id}/non-lues`); }
  countNonLues(id: number): Observable<number>                   { return this.http.get<number>(`${this.url}/membre/${id}/count`); }
  marquerLue(id: number): Observable<void>                       { return this.http.patch<void>(`${this.url}/${id}/lue`, {}); }
}