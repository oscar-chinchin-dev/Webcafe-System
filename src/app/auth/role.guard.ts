import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class roleGuard implements CanActivate {

  constructor(
    private AuthService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // Recupera los roles permitidos definidos en la configuración de la ruta (app.routes.ts)
    const expectedRoles = route.data['roles'] as string[];

    const token = this.AuthService.getToken();
    const rol = this.AuthService.getRol();

    // 1. Verificación de Autenticación: Si no hay token, rebota al login

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // 2. Verificación de Autorización: Si el rol del usuario no está en la lista permitida para esta ruta

    if (expectedRoles && !expectedRoles.includes(rol)) {
      this.router.navigate(['/login']);
      return false;
    }

    // Si pasa ambas pruebas, se permite el acceso a la ruta

    return true;
  }
}
