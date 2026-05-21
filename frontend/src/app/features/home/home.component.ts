import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { Category, Product } from '@core/models/domain.models';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'cs-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private readonly api = inject(ApiService);

  readonly categories$: Observable<Category[]> = this.api.listCategories().pipe(catchError(() => of([] as Category[])));

  readonly featured$: Observable<Product[]> = this.api
    .listProducts({ page: 0, size: 6, sort: 'createdAt,desc' })
    .pipe(
      map((res) => res.content),
      catchError(() => of([] as Product[])),
    );

  readonly highlights = [
    { icon: 'verified', title: 'Trusted brands', text: 'Authorised supplier for UltraTech, ACC, JSW, Tata Tiscon and more.' },
    { icon: 'local_shipping', title: 'On-time delivery', text: 'Same-day dispatch within Hyderabad; next-day across Telangana & AP.' },
    { icon: 'request_quote', title: 'Bulk pricing', text: 'Competitive project-rate quotes — submit your BOQ and we revert in 24 hours.' },
    { icon: 'support_agent', title: 'Site support', text: 'Technical consultation and surveying for builders and contractors.' },
  ];

  readonly testimonials = [
    { name: 'Ravi Reddy', role: 'Senior Project Manager — InfraPro Builders', quote: 'Reliable cement & TMT supply across three of our sites — never missed a milestone in eighteen months.' },
    { name: 'Anitha Sharma', role: 'Architect', quote: 'Quick turnaround on quotes and quality bricks delivered on schedule. Highly recommend for residential projects.' },
    { name: 'M. Kiran', role: 'Civil Contractor', quote: 'Their RMC pumping crew is professional and on time. Fair pricing on bulk orders too.' },
  ];
}
