import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CajaService, CajaActual, ResumenCierre } from '../../../core/services/caja.service';
import { CierreListItem } from '../../../core/services/caja.service';

@Component({
  selector: 'app-cierres-admin',
  standalone: true,
  styleUrl: './cierres.admin.component.css',
  imports: [CommonModule],
  templateUrl: './cierres.admin.component.html'
})
export class CierresAdminComponent implements OnInit {
  // Lista general de cierres para la tabla principal

  cierres: CierreListItem[] = [];
  loading = false;
  errorMsg = '';

  // Almacena el detalle de un cierre específico cuando se selecciona
  resumen: ResumenCierre | null = null;
  // Controla qué fila de la tabla está expandida visualmente
  expandedId: number | null = null;

  constructor(private cajaService: CajaService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargar();
  }

  // Carga inicial del historial de cierres desde el servicio
  cargar() {
    this.loading = true;
    this.errorMsg = '';
    this.cajaService.getCierres().subscribe({
      next: (res) => {
        this.cierres = res;
        this.loading = false;
        // Fuerza la actualización de la vista para mostrar los nuevos datos
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg = 'Error cargando cierres';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Gestiona la expansión/contracción de los detalles de un cierre.
   * Si el cierre ya está expandido, lo cierra. Si no, busca su resumen.
   */
  toggleDetalle(id: number) {
    if (this.expandedId === id) {
      this.expandedId = null;
      this.resumen = null;
      this.cdr.detectChanges();
      return;
    }

    this.expandedId = id;
    this.cdr.detectChanges();

    // Petición bajo demanda: Solo trae el resumen si el usuario hace clic en la fila
    this.cajaService.getResumen(id).subscribe({
      next: (r) => {
        this.resumen = r;
        this.cdr.detectChanges();
      }
    });
  }
}
