import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Producto {
  productoId: number;
  nombre: string;
  precio: number;
  categoriaId: number; // Relación con CategoriaService
  activo: boolean;
  categoriaNombre?: string; // Propiedad opcional para mostrar el nombre sin buscar el ID
  stock: number; // Control de inventario disponible
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'https://localhost:7107/api/productos';

  constructor(private http: HttpClient) { }

  // Obtiene la lista de productos enviando el Token manualmente para autorización

  getAll() {
    const token = localStorage.getItem('token');

    return this.http.get<Producto[]>(
      'https://localhost:7107/api/productos',
      {
        headers: {
          Authorization: `Bearer ${token}` // Formato estándar JWT para el Backend
        }
      }
    );
  }

  // Registra un nuevo producto en el catálogo

  create(data: Partial<Producto>): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualiza datos (precio, nombre, stock) de un producto existente

  update(id: number, data: Partial<Producto>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Elimina un producto por su ID

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
