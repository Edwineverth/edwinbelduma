// src/app/components/confirm-dialog/confirm-dialog.component.ts
import { Component, EventEmitter, Output, Input } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="modal">
      <div class="modal-content">
        <p>{{ message }}</p>
        <div class="separator" *ngIf="type === 'confirm'"></div>
        <div class="modal-actions">
          <button *ngIf="type === 'confirm'" class="cancel-button" (click)="onCancel()">Cancelar</button>
          <button (click)="onConfirm()"
                  [ngClass]="{'confirm-button': type === 'confirm', 'info-button': type === 'info'}">{{ type === 'confirm' ? 'Confirmar' : 'Aceptar' }}
          </button>
        </div>
      </div>
    </div>
  `,
  imports: [
    NgClass,
    NgIf
  ],
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  @Input() message: string = '';
  @Input() type: 'confirm' | 'info' = 'confirm';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
