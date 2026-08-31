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

      <!-- Icon -->
      <div class="dialog-icon" [ngClass]="data.type || 'danger'">
        <mat-icon>
          {{ data.type === 'warning' ? 'warning' :
             data.type === 'info'    ? 'info' : 'delete_forever' }}
        </mat-icon>
      </div>

      <!-- Title -->
      <h2 class="dialog-title">{{ data.title }}</h2>

      <!-- Message -->
      <p class="dialog-message">{{ data.message }}</p>

      <!-- Actions -->
      <div class="dialog-actions">
        <button mat-stroked-button
                class="cancel-btn"
                (click)="onCancel()">
          <mat-icon>close</mat-icon>
          {{ data.cancelText || 'Annuler' }}
        </button>
        <button mat-raised-button
                class="confirm-btn"
                [ngClass]="data.type || 'danger'"
                (click)="onConfirm()">
          <mat-icon>
            {{ data.type === 'warning' ? 'warning' :
               data.type === 'info'    ? 'check' : 'delete' }}
          </mat-icon>
          {{ data.confirmText || 'Supprimer' }}
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
      max-width: 420px;
      text-align: center;
    }

    /* ── Icon circle ── */
    .dialog-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;

      mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
      }

      &.danger {
        background: #ffebee;
        mat-icon { color: #f44336; }
      }

      &.warning {
        background: #fff8e1;
        mat-icon { color: #ff9800; }
      }

      &.info {
        background: #e3f2fd;
        mat-icon { color: #2196f3; }
      }
    }

    /* ── Title ── */
    .dialog-title {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 12px;
    }

    /* ── Message ── */
    .dialog-message {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin: 0 0 28px;
    }

    /* ── Actions ── */
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

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
    }

    .confirm-btn {
      flex: 1;
      height: 44px;
      border-radius: 8px !important;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }

      &.danger  { background: #f44336 !important; color: white !important; }
      &.warning { background: #ff9800 !important; color: white !important; }
      &.info    { background: #2196f3 !important; color: white !important; }
    }
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