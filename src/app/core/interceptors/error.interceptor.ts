import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        //  Token inválido / expirado
        if (error.status === 401) {
          console.error('No autorizado (401)');
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }

        //  Prohibido
        if (error.status === 403) {
          console.error('Acceso denegado (403)');
          alert('No tienes permisos para esta acción');
        }

        //  Error de validación
        if (error.status === 400) {
          return throwError(() => error);
        }

        //  Error servidor
        if (error.status === 500) {
          alert('Error interno del servidor');
        }

        return throwError(() => error);
      })
    );
  }
}