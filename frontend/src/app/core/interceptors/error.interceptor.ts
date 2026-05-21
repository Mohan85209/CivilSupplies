import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 0) {
        notify.error('Cannot reach server. Check your internet connection.');
      } else if (err.status === 401) {
        auth.logout();
        void router.navigate(['/admin/login']);
      } else if (err.status === 403) {
        notify.error('You do not have permission to perform this action.');
      } else if (err.status === 429) {
        notify.error('Too many requests. Please wait a moment and try again.');
      } else if (err.status >= 500) {
        notify.error('Server error. Our team has been notified.');
      } else {
        const message = err.error?.message ?? err.message ?? 'Something went wrong.';
        if (!req.url.includes('/admin/login')) notify.error(message);
      }
      return throwError(() => err);
    }),
  );
};
