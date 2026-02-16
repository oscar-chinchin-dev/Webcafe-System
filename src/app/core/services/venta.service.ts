import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// DTO para enviar al servidor: Solo lo mínimo necesario (ID de producto y cuántos)

export interface CrearVentaDto {
  detalles: {
    productoId: number;
    cantidad: number;
  }[];
}

// Interfaz completa que recibimos del servidor para el historial o tickets

export interface Venta {
  ventaId: number;
  fecha: string;
  total: number;
  usuarioNombre: string;
  cajero: string;
  estado: string;
  anulada: boolean;
  detalles: VentaDetalle[];
}


export interface VentaDetalle {
  productoNombre: string;
  cantidad: number;
  precio: number;

}

// Estructuras para la parte administrativa de la cafetería (Analítica)

export interface ReporteVentaItem {
  ventaId: number;
  fecha: string;
  total: number;
  cajero: string;
}

export interface ReporteDiarioResponse {
  fecha: string;
  cantidadVentas: number;
  totalVendido: number;
  ventas: ReporteVentaItem[];
}

export interface ReporteRangoResponse {
  desde: string;
  hasta: string;
  cantidadVentas: number;
  totalVendido: number;
  ventas: ReporteVentaItem[];
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl = 'https://localhost:7107/api/ventas';

  constructor(private http: HttpClient) { }


  // Envía el pedido al backend para procesar el pago y descontar stock

  crearVenta(venta: any) {
    return this.http.post(this.apiUrl, venta);
  }

  // Métodos para visualizar el historial general de transacciones

  getAll(): Observable<Venta[]> {

    return this.http.get<Venta[]>(this.apiUrl);
  }
  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}`);
  }

  // Recupera el detalle específico de una venta (útil para reimprimir tickets)

  getById(id: number) {
    return this.http.get<Venta>(`${this.apiUrl}/${id}`);
  }

  // Genera el resumen financiero del día en curso

  reporteDiario(): Observable<ReporteDiarioResponse> {
    return this.http.get<ReporteDiarioResponse>(`${this.apiUrl}/reporte-diario`);
  }

  // Consulta histórica filtrada por fechas para auditorías o balances mensuales

  reporteRango(desde: string, hasta: string): Observable<ReporteRangoResponse> {
    return this.http.get<ReporteRangoResponse>(
      `${this.apiUrl}/reporte-rango?desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}`
    );
  }

}
