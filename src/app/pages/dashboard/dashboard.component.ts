import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CajaActual, CajaService } from '../../core/services/caja.service';
import { ReporteDiarioResponse, VentaService } from '../../core/services/venta.service';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ApplicationRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  loading = false;
  errorMsg = '';

  // Datos de la sesión de caja y del reporte de ventas diario
  caja: CajaActual | null = null;
  diario: ReporteDiarioResponse | null = null;

  // Variables calculadas para mostrar en las "tarjetas" del dashboard

  totalHoy = 0;
  cantidadHoy = 0;
  ultimaVenta: any = null;

  constructor(
    private cajaService: CajaService,
    private ventaService: VentaService,
    private router: Router,
    private appRef: ApplicationRef,
    private cdr: ChangeDetectorRef,

  ) { }

  // Escucha la navegación para refrescar los datos automáticamente si el usuario vuelve al Dashboard

  ngOnInit(): void {

    // Esto está bien, lo puedes dejar
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.cargarDashboard());


    this.cargarDashboard();



  }

  /**
   * Carga masiva de datos. Utiliza forkJoin para disparar ambas peticiones 
   * en paralelo y esperar a que ambas terminen antes de actualizar la UI.
   */

  cargarDashboard() {
    this.loading = true;
    this.errorMsg = '';


    forkJoin({
      caja: this.cajaService.getCajaActual(),
      diario: this.ventaService.reporteDiario()
    }).subscribe({
      next: ({ caja, diario }) => {
        this.caja = caja;
        this.diario = diario;

        // Extrae totales y la última transacción para el resumen visual
        this.totalHoy = diario?.totalVendido ?? 0;
        this.cantidadHoy = diario?.cantidadVentas ?? 0;
        this.ultimaVenta = diario?.ventas?.length ? diario.ventas[0] : null;

        this.loading = false;
        // Notifica a Angular que los datos han cambiado para refrescar la vista
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error dashboard:', err);
        this.errorMsg = 'Error cargando dashboard';
        this.loading = false;

      }
    });
  }
}