import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define el estado actual de la caja para saber si el cajero puede empezar a vender

export interface CajaActual {
  cierreCajaId: number;
  fechaApertura: string;
  montoInicial: number;
  estado: string; // "ABIERTA" | "CERRADA"
}


// Estructura detallada para el reporte de arqueo (comparación esperado vs real)

export interface ResumenCierre {
  cierreCajaId: number;
  cajero: string;
  fechaApertura: string;
  fechaCierre: string;
  estado: string;
  montoInicial: number;
  totalVentas: number;
  cantidadVentas: number;
  montoFinalDeclarado: number | null;
  esperado: number;
  diferencia: number;
}

// Representación simplificada para el historial de cierres

export interface CierreListItem {
  cierreCajaId: number;
  cajero: string;
  fechaApertura: string;
  fechaCierre: string | null;
  estado: string;
  montoInicial: number;
  totalVentas: number;
  cantidadVentas: number;
  montoFinalDeclarado: number | null;
}



@Injectable({ providedIn: 'root' })
export class CajaService {
  private apiUrl = 'https://localhost:7107/api/caja';

  constructor(private http: HttpClient) { }

  // Verifica si hay una sesión de caja activa al iniciar el día

  getCajaActual(): Observable<CajaActual | null> {
    return this.http.get<CajaActual | null>(`${this.apiUrl}/actual`);
  }

  // Registra el dinero base con el que inicia el turno

  abrirCaja(montoInicial: number) {
    return this.http.post(`${this.apiUrl}/abrir`, { montoInicial });
  }

  // Finaliza el turno enviando el monto contado físicamente (opcional)

  cerrarCaja(cierreCajaId: number, montoFinalDeclarado?: number | null) {
    return this.http.post(`${this.apiUrl}/${cierreCajaId}/cerrar`, {
      montoFinalDeclarado: montoFinalDeclarado ?? null
    });
  }

  // Obtiene los cálculos finales (ventas + inicial) para el reporte de cierre

  getResumen(cierreCajaId: number) {
    return this.http.get<ResumenCierre>(`${this.apiUrl}/${cierreCajaId}/resumen`);
  }

  // Recupera el historial completo de todos los cierres realizados

  getCierres() {
    return this.http.get<CierreListItem[]>(`${this.apiUrl}/cierres`);
  }
}
