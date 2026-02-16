import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Venta, VentaService } from '../../core/services/venta.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-ventas-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas.admin.component.html',
  styleUrl: './ventas.admin.component.css',
})





export class VentasAdminComponent implements OnInit {

  ventas: Venta[] = [];
  ventaSeleccionada: Venta | null = null;
  // Controla qué venta muestra su desglose en la tabla

  ventaExpandidaId: number | null = null;
  loading = false;
  errorMsg = '';
  toast = { show: false, text: '', type: 'ok' as 'ok' | 'bad' };




  constructor(
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarVentas();
  }

  // Obtiene el listado general de ventas realizado en la cafetería

  cargarVentas() {
    console.log('Cargando ventas...');
    this.loading = true;
    this.errorMsg = '';


    this.ventaService.getAll().subscribe({

      next: res => {
        this.ventas = res; this.loading = false;
        this.cdr.detectChanges();
      },

      error: err => { this.errorMsg = 'Error cargando ventas'; this.loading = false; }


    });
  }

  /**
   * Gestiona el acordeón de la tabla. 
   * Si la venta no tiene detalles cargados, los solicita al servidor (Lazy Loading).
   */
  toggleDetalle(id: number) {

    if (this.ventaExpandidaId === id) {
      this.ventaExpandidaId = null;
      this.cdr.detectChanges();
      return;
    }


    this.ventaExpandidaId = id;
    this.cdr.detectChanges();


    // Enriquecimiento de datos: Busca los detalles (productos) de una venta específica
    this.ventaService.getById(id).subscribe({
      next: (ventaConDetalle) => {
        const i = this.ventas.findIndex(v => v.ventaId === id);
        if (i >= 0) {
          this.ventas[i] = { ...this.ventas[i], ...ventaConDetalle };
        }


        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  // Métodos para manejar la vista modal o detallada de una venta
  verDetalle(venta: Venta) {
    this.ventaSeleccionada = venta;

  }

  cerrarDetalle() {
    this.ventaSeleccionada = null;
  }

  showToast(text: string, type: 'ok' | 'bad' = 'ok') {
    this.toast = { show: true, text, type };
    setTimeout(() => this.toast.show = false, 2200);
  }

  /**
   * Prepara la venta para impresión. 
   * Asegura que los detalles existan antes de disparar el diálogo de impresión del navegador.
   */

  imprimirVenta(v: Venta) {
    this.ventaService.getById(v.ventaId).subscribe({
      next: (ventaConDetalle) => {
        this.ventaSeleccionada = ventaConDetalle;

        this.cdr.detectChanges();

        setTimeout(() => window.print(), 50);
      },

      error: err => console.error(err)

    });
  }
}

