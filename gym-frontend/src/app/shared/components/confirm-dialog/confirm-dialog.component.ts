import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">

      <div class="dialog-icon" [ngClass]="data.type || 'danger'">
        <mat-icon>
          {{ data.type === 'warning' ? 'warning' :
             data.type === 'info'    ? 'info' : 'delete_forever' }}
        </mat-icon>
      </div>

      <h2 class="dialog-title">{{ data.title }}</h2>

      <p class="dialog-message" style="white-space: pre-line">{{ data.message }}</p>

      <div class="dialog-actions">
        <button mat-stroked-button
                class="cancel-btn"
                (click)="onCancel()"
                *ngIf="data.cancelText">
          <mat-icon>close</mat-icon>
          {{ data.cancelText }}
        </button>
        <button mat-raised-button
                class="confirm-btn"
                [ngClass]="data.type || 'danger'"
                (click)="onConfirm()">
          <mat-icon>
            {{ data.type === 'warning' ? 'warning' :
               data.type === 'info'    ? 'check' : 'delete' }}
          </mat-icon>
          {{ data.confirmText || 'Confirmer' }}
        </button>
      </div>

    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 28px 24px;
      max-width: 440px;
      text-align: center;
    }

    .dialog-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .dialog-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .dialog-icon.danger  { background: #ffebee; }
    .dialog-icon.danger mat-icon  { color: #f44336; }

    .dialog-icon.warning { background: #fff8e1; }
    .dialog-icon.warning mat-icon { color: #ff9800; }

    .dialog-icon.info    { background: #e3f2fd; }
    .dialog-icon.info mat-icon    { color: #2196f3; }

    .dialog-title {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 12px;
    }

    .dialog-message {
      font-size: 14px;
      color: #555;
      line-height: 1.7;
      margin: 0 0 28px;
      text-align: left;
      width: 100%;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 12px 16px;
    }

    .dialog-actions {
      display: flex;
      gap: 12px;
      width: 100%;
      justify-content: center;
    }

    .cancel-btn {
      flex: 1;
      height: 44px;
      border-radius: 8px !important;
      color: #555;
      border-color: #ddd !important;
    }

    .cancel-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }

    .confirm-btn {
      flex: 1;
      height: 44px;
      border-radius: 8px !important;
    }

    .confirm-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }

    .confirm-btn.danger  { background: #f44336 !important; color: white !important; }
    .confirm-btn.warning { background: #ff9800 !important; color: white !important; }
    .confirm-btn.info    { background: #2196f3 !important; color: white !important; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void { this.dialogRef.close(true); }
  onCancel(): void  { this.dialogRef.close(false); }
}