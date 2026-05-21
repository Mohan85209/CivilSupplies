import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from '@shared/components/site-header/site-header.component';
import { SiteFooterComponent } from '@shared/components/site-footer/site-footer.component';
import { WhatsappFabComponent } from '@shared/components/whatsapp-fab/whatsapp-fab.component';
import { LoadingBarComponent } from '@shared/components/loading-bar/loading-bar.component';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'cs-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    WhatsappFabComponent,
    LoadingBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cs-loading-bar />
    <cs-site-header />
    <main class="site-main">
      <router-outlet />
    </main>
    <cs-site-footer />
    <cs-whatsapp-fab />
  `,
  styles: [
    `
      .site-main {
        min-height: calc(100vh - var(--header-height));
        padding-top: var(--header-height);
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private readonly theme = inject(ThemeService);

  ngOnInit(): void {
    this.theme.applyStoredTheme();
  }
}
