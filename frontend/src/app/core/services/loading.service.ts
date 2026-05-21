import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private active = 0;
  readonly loading = signal(false);

  start(): void {
    this.active++;
    this.loading.set(true);
  }

  stop(): void {
    this.active = Math.max(0, this.active - 1);
    if (this.active === 0) this.loading.set(false);
  }
}
