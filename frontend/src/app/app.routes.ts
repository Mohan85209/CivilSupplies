import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards/admin.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/home/home.component').then((m) => m.HomeComponent),
    title: 'Civil Engineering Supplies | Hyderabad',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('@features/products/products.component').then((m) => m.ProductsComponent),
    title: 'Products | Civil Supplies',
  },
  {
    path: 'products/:slug',
    loadComponent: () =>
      import('@features/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('@features/services-page/services-page.component').then((m) => m.ServicesPageComponent),
    title: 'Services | Civil Supplies',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('@features/about/about.component').then((m) => m.AboutComponent),
    title: 'About Us | Civil Supplies',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('@features/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact Us | Civil Supplies',
  },
  {
    path: 'quote',
    loadComponent: () =>
      import('@features/quote/quote.component').then((m) => m.QuoteComponent),
    title: 'Request a Quote | Civil Supplies',
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('@features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
    title: 'Your Wishlist',
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('@features/admin/login/admin-login.component').then((m) => m.AdminLoginComponent),
    title: 'Admin Login',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('@features/admin/dashboard/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@features/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'enquiries',
        loadComponent: () =>
          import('@features/admin/enquiries/admin-enquiries.component').then((m) => m.AdminEnquiriesComponent),
      },
      {
        path: 'quotes',
        loadComponent: () =>
          import('@features/admin/quotes/admin-quotes.component').then((m) => m.AdminQuotesComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('@features/admin/products/admin-products.component').then((m) => m.AdminProductsComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('@features/admin/users/admin-users.component').then((m) => m.AdminUsersComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('@features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page Not Found',
  },
];
