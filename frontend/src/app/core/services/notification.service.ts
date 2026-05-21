import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snack = inject(MatSnackBar);

  success(message: string): void {
    this.snack.open(message, 'OK', { panelClass: ['snack-success'] });
  }

  error(message: string): void {
    this.snack.open(message, 'Dismiss', { panelClass: ['snack-error'], duration: 6500 });
  }

  info(message: string): void {
    this.snack.open(message, 'OK');
  }
}
