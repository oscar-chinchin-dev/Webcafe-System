import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../../core/services/producto.service';
import { VentaService, CrearVentaDto } from '../../core/services/venta.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-venta',
  standalone: true,
  styleUrl: './venta.component.css',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './venta.component.html'
})
export class VentaComponent implements OnInit {

  productos: Producto[] = [];
  carrito: {
    productoId: number;
    nombre: string;
    precio: number;
    cantidad: number;


  }[] = [];

  total = 0;

  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('VentaComponent INIT');
    this.cargarProductos();
  }

  cargarProductos() {
    console.log('Cargando productos...');
    this.productoService.getAll().subscribe(res => {
      console.log('Productos recibidos en VentaComponent:', res);
      this.productos = res;
      this.cdr.detectChanges(); // 👈 fuerza render
    });
  }

  agregarProducto(p: Producto) {
    if (p.stock <= 0) return; // seguridad extra

    const existente = this.carrito.find(c => c.productoId === p.productoId);

    if (existente) {
      // No permitir agregar más que el stock disponible (ya vamos descontando)
      existente.cantidad++;
    } else {
      this.carrito.push({
        productoId: p.productoId,
        nombre: p.nombre,
        precio: p.precio,
        cantidad: 1,

      });
    }


    // Descuenta stock en la lista visible
    p.stock--;

    this.calcularTotal();
  }


  calcularTotal() {
    this.total = this.carrito.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
  }

  confirmarVenta() {
    if (this.carrito.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    const dto: CrearVentaDto = {
      detalles: this.carrito.map(c => ({
        productoId: c.productoId,
        cantidad: c.cantidad
      }))
    };

    this.ventaService.crearVenta(dto).subscribe({
      next: () => {
        alert('Venta registrada correctamente');
        this.carrito = [];
        this.total = 0;
        this.cargarProductos(); // sincroniza stock real
      },
      error: err => {
        console.error('Error backend:', err.error);

        // Mensaje útil
        const msg =
          typeof err?.error === 'string'
            ? err.error
            : 'Error al registrar la venta';

        alert(msg);

        // IMPORTANTE: revertir visualmente recargando
        this.cargarProductos();
      }
    });
  }

  quitarUno(item: { productoId: number; nombre: string; precio: number; cantidad: number }) {
    const prod = this.productos.find(p => p.productoId === item.productoId);
    if (!prod) return;

    // Devuelve 1 al stock visual
    prod.stock++;

    // Baja cantidad en carrito
    item.cantidad--;

    // Si quedó en 0, lo sacamos
    if (item.cantidad <= 0) {
      this.carrito = this.carrito.filter(c => c.productoId !== item.productoId);
    }

    this.calcularTotal();
  }

  quitarItemCompleto(item: { productoId: number; nombre: string; precio: number; cantidad: number }) {
    const prod = this.productos.find(p => p.productoId === item.productoId);
    if (!prod) return;

    // Devuelve todo al stock visual
    prod.stock += item.cantidad;

    // Quita del carrito
    this.carrito = this.carrito.filter(c => c.productoId !== item.productoId);

    this.calcularTotal();
  }

  vaciarCarrito() {
    // Devuelve todo el stock visual
    for (const item of this.carrito) {
      const prod = this.productos.find(p => p.productoId === item.productoId);
      if (prod) prod.stock += item.cantidad;
    }

    this.carrito = [];
    this.total = 0;
  }
}
