import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Variables vinculadas a los inputs del formulario (Two-way binding)

  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {

        // Almacena las credenciales en el navegador para mantener la sesión activa

        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.rol);

        // Lógica de enrutamiento según el nivel de acceso (RBAC en frontend)
        if (res.rol === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/caja']);
        }
      },
      error: (err) => {
        // Captura de errores de autenticación (ej: credenciales incorrectas)
        console.error('ERROR LOGIN', err);
      }
    });
  }
}
