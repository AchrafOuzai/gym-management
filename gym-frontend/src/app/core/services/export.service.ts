import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private url = `${environment.apiUrl}/export`;
  constructor(private http: HttpClient) {}

  private download(url: string, filename: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  exportMembresExcel(): void {
    this.download(`${this.url}/membres/excel`, `membres_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  exportMembresPdf(): void {
    this.download(`${this.url}/membres/pdf`, `membres_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  exportPaiementsExcel(): void {
    this.download(`${this.url}/paiements/excel`, `paiements_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}