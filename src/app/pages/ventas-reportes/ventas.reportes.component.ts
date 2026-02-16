import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../core/services/venta.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  styleUrl: './ventas.reportes.component.css',
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.reportes.component.html'
})
export class VentasReportesComponent {

  loading = false;
  errorMsg = '';

  // Variables para almacenar la respuesta según el tipo de consulta

  diario: any = null;
  rango: any = null;

  // Variables vinculadas a los inputs de tipo date en el HTML
  desde = '';
  hasta = '';

  constructor(private ventaService: VentaService,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Obtiene las ventas del día actual.
   * Limpia el estado del reporte por rango para evitar confusión visual.
   */

  cargarDiario() {
    this.loading = true;
    this.errorMsg = '';
    this.rango = null;

    this.ventaService.reporteDiario().subscribe({
      next: (res) => {
        this.diario = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.errorMsg = err?.error ?? 'Error cargando reporte diario';
      }
    });
  }

  /**
   * Consulta ventas en un periodo específico definido por el usuario.
   * Valida que las fechas estén presentes antes de realizar la petición.
   */

  cargarRango() {
    if (!this.desde || !this.hasta) {
      this.errorMsg = 'Seleccione desde y hasta';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.diario = null;


    this.ventaService.reporteRango(this.desde, this.hasta).subscribe({
      next: (res) => {
        this.rango = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error ?? 'Error cargando reporte por rango';
        this.cdr.detectChanges();
      }
    });
  }
}