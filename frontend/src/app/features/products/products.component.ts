import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap, takeUntil } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { Category, PageResponse, Product, ProductFilter } from '@core/models/domain.models';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { ComingSoonComponent, ComingSoonItem } from '@shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'cs-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ProductCardComponent,
    ComingSoonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly sortControl = new FormControl<ProductFilter['sort']>('createdAt,desc', { nonNullable: true });

  readonly categories = signal<Category[]>([]);
  readonly selectedCategory = signal<string | null>(null);
  readonly page = signal<PageResponse<Product> | null>(null);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(12);
  readonly loading = signal(false);

  readonly upcomingProducts: ComingSoonItem[] = [
    {
      icon: 'precision_manufacturing',
      title: 'Precast & Hollow-Core Slabs',
      description: 'Factory-cast slabs for faster, cleaner, more accurate construction.',
      tag: 'Q3 launch',
    },
    {
      icon: 'roofing',
      title: 'Steel Roofing Sheets',
      description: 'Colour-coated TATA Durashine and JSW Vishwas roofing sheets — full warehouse stock.',
      tag: 'Stocking soon',
    },
    {
      icon: 'water',
      title: 'PVC & CPVC Plumbing Systems',
      description: 'Astral and Supreme pipes, fittings, and chemicals for plumbing & sanitation.',
      tag: 'In review',
    },
    {
      icon: 'bolt',
      title: 'Electrical Conduits & Wiring',
      description: 'Anchor, Polycab and Havells essentials for electrical first-fix supply.',
      tag: 'Coming Q4',
    },
  ];

  ngOnInit(): void {
    this.api
      .listCategories()
      .pipe(catchError(() => of([] as Category[])), takeUntil(this.destroy$))
      .subscribe((c) => this.categories.set(c));

    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.selectedCategory.set(params.get('category'));
      this.searchControl.setValue(params.get('q') ?? '', { emitEvent: false });
      this.pageIndex.set(Number(params.get('page') ?? 0));
      this.load();
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((q) => this.updateQuery({ q, page: 0 }));

    this.sortControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.load());
  }

  selectCategory(slug: string | null): void {
    this.updateQuery({ category: slug, page: 0 });
  }

  onPageChange(event: PageEvent): void {
    this.updateQuery({ page: event.pageIndex, size: event.pageSize });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.updateQuery({ category: null, q: '', page: 0 });
  }

  private updateQuery(patch: Record<string, unknown>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.route.snapshot.queryParams, ...patch },
      queryParamsHandling: 'merge',
    });
  }

  private load(): void {
    this.loading.set(true);
    const filter: ProductFilter = {
      category: this.selectedCategory() ?? undefined,
      q: this.searchControl.value || undefined,
      page: this.pageIndex(),
      size: this.pageSize(),
      sort: this.sortControl.value,
    };
    this.api
      .listProducts(filter)
      .pipe(
        switchMap((res) => of(res)),
        catchError(() => of<PageResponse<Product>>({ content: [], totalElements: 0, totalPages: 0, number: 0, size: filter.size ?? 12, first: true, last: true })),
        takeUntil(this.destroy$),
      )
      .subscribe((res) => {
        this.page.set(res);
        this.loading.set(false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
