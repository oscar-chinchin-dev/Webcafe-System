import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

// Estructura de la respuesta esperada desde el backend de la cafetería

interface LoginResponse {
  token: string;
  nombre: string;
  rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'https://localhost:7107/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(

      // tap permite ejecutar efectos secundarios (guardar datos) sin alterar el flujo del Observable

      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('nombre', res.nombre);
      })
    );
  }

  // Limpia toda la sesión (token, rol, nombre) para cerrar sesión de forma segura

  logout() {
    localStorage.clear();
  }

  // Métodos auxiliares para consultar el estado de la sesión desde cualquier componente

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string {
    return localStorage.getItem('rol') || '';
  }

  // Comprobación rápida de sesión activa (convierte el token en booleano)

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
