import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Silently ignore 404s for payment lookups — orders may not have payments yet
      if (error.status === 404 && req.url.includes('/payments/order/')) {
        return throwError(() => error);
      }

      if (error.error instanceof ErrorEvent) {
        console.error(`Error: ${error.error.message}`);
      } else {
        switch (error.status) {
          case 401:
            localStorage.removeItem('auth_token');
            router.navigate(['/auth/login']);
            break;
          case 403:
            console.error('Access forbidden');
            break;
          case 404:
            console.error('Resource not found');
            break;
          case 500:
            console.error('Internal server error');
            break;
          default:
            console.error(`Error Code: ${error.status}\nMessage: ${error.message}`);
        }
      }

      return throwError(() => error);
    })
  );
};
