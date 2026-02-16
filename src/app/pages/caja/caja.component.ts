import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../core/services/venta.service';
import { VentaComponent } from '../venta/venta.component';
import { CajaService, CajaActual, ResumenCierre } from '../../core/services/caja.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-caja',
  standalone: true,
  styleUrl: './caja.component.css',
  imports: [CommonModule, FormsModule, VentaComponent],
  templateUrl: './caja.component.html'
})
export class CajaComponent implements OnInit {

  // Almacena la info de la sesión actual (ID, fecha, monto inicial)
  cajaActual: CajaActual | null = null;
  cajaAbierta = false;

  montoInicial = 0;
  montoFinalDeclarado: number | null = null;

  loading = false;
  errorMsg = '';
  toast = { show: false, text: '', type: 'ok' as 'ok' | 'bad' };
  resumen: ResumenCierre | null = null;




  totalActual = 0;



  constructor(private cajaService: CajaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarCajaActual();

    // Re-verifica el estado de la caja cada vez que el usuario navega de vuelta a este componente

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.cargarCajaActual();
      });
  }

  // Consulta al servidor si existe un registro de caja "ABIERTA" para el día de hoy

  cargarCajaActual() {
    this.loading = true;
    this.errorMsg = '';

    this.cajaService.getCajaActual().subscribe({
      next: (res) => {
        this.cajaActual = res;
        this.cajaAbierta = !!res && res.estado === 'ABIERTA';
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg = 'Error cargando estado de caja';
        this.loading = false;


        this.cdr.detectChanges();
      }
    });
  }

  // Inicia el turno de la cafetería con el fondo de caja

  abrirCaja() {
    if (this.montoInicial < 0) {
      alert('Monto inicial inválido');
      return;
    }

    this.loading = true;
    this.cajaService.abrirCaja(this.montoInicial).subscribe({
      next: () => {
        this.showToast('Caja abierta', 'ok');
        this.cargarCajaActual();
        this.cdr.detectChanges();



      },
      error: (err) => {
        console.error(err);
        alert(err?.error ?? 'Error al abrir caja');
        this.loading = false;
      }
    });
  }

  // Finaliza el turno y recibe el arqueo (ventas calculadas vs dinero en mano)

  cerrarCaja() {
    if (!this.cajaActual) return;

    this.loading = true;
    this.cajaService.cerrarCaja(this.cajaActual.cierreCajaId, this.montoFinalDeclarado).subscribe({
      next: (res: any) => {
        this.showToast('Caja cerrada', 'ok');


        this.resumen = res;

        this.montoFinalDeclarado = null;
        this.cargarCajaActual();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showToast(err?.error ?? 'Error al cerrar caja', 'bad');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Notificación visual rápida de éxito o error

  showToast(text: string, type: 'ok' | 'bad' = 'ok') {
    this.toast = { show: true, text, type };
    setTimeout(() => (this.toast.show = false), 2500);
  }

  // Lógica simple para imprimir el ticket de cierre de caja (arqueo)

  imprimirResumen() {
    if (!this.resumen) return;


    this.cdr.detectChanges();
    setTimeout(() => window.print(), 50);
  }
}
