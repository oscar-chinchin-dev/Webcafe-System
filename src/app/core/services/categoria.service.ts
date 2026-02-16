import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


// Estructura de datos para clasificar los productos del menú

export interface Categoria {
  categoriaId: number;
  nombre: string;
  activo: boolean; // Permite ocultar categorías sin borrarlas (ej: productos de temporada)
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = 'https://localhost:7107/api/categorias';

  constructor(private http: HttpClient) { }

  // Obtiene la lista completa de categorías para llenar selectores o tablas

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // Registra una nueva categoría (usa Partial porque el ID lo genera el server)

  create(data: Partial<Categoria>): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualiza nombre o estado de una categoría existente mediante su ID

  update(id: number, data: Partial<Categoria>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Elimina la categoría físicamente de la base de datos

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}