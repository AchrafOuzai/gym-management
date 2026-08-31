import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats, ChartData } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private url = `${environment.apiUrl}/dashboard`;
  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.url}/stats`);
  }

  getRevenusParMois(year: number): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.url}/charts/revenus?year=${year}`);
  }

  getNouveauxMembres(year: number): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.url}/charts/membres?year=${year}`);
  }

  getStatutsMembres(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.url}/charts/statuts`);
  }
}