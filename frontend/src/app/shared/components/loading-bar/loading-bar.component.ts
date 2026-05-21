import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '@core/services/loading.service';

@Component({
  selector: 'cs-loading-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading.loading()) {
      <div class="bar" role="progressbar" aria-label="Loading"></div>
    }
  `,
  styles: [
    `
      .bar {
        position: fixed;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, var(--color-orange), transparent);
        z-index: 200;
        animation: slide 1.2s linear infinite;
      }
      @keyframes slide {
        from { background-position: -200px 0; }
        to { background-position: 200px 0; }
      }
    `,
  ],
})
export class LoadingBarComponent {
  readonly loading = inject(LoadingService);
}
