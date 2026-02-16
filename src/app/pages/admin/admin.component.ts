import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../../core/services/categoria.service';
import { ProductoService, Producto } from '../../core/services/producto.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {



  categorias: Categoria[] = [];
  categoriaForm!: FormGroup;
  categoriaEditandoId: number | null = null;
  productos: Producto[] = [];
  productoForm!: FormGroup;
  productoEditandoId: number | null = null;
  errorProducto: string | null = null;
  errorCategoria: string | null = null;
  erroresBackend: any = null;



  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,

  ) { }

  ngOnInit(): void {
    // Inicialización de formularios con sus respectivas reglas de validación


    this.crearCategoriaForm();
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      activo: [true]
    });

    // Carga inicial de datos desde el backend
    this.cargarCategorias();

    this.crearProductoForm();
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(1)]],
      categoriaId: [null, Validators.required],
      activo: [true]
    });



    this.cargarProductos();
  }

  // --- LÓGICA DE CATEGORÍAS ---

  cargarCategorias() {
    this.categoriaService.getAll().subscribe({
      next: res => {
        // Normalización: Asegura que el valor 'activo' sea booleano para el checkbox
        this.categorias = res.map((c: any) => ({
          ...c,
          activo: c.activo === true || c.activo === 'true'
        }));
      }
    });
  }
  guardarCategoria() {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched(); // Muestra errores visuales
      return;
    }

    const data = this.categoriaForm.value;

    if (this.categoriaEditandoId) {
      // Flujo de actualización (PUT)
      this.categoriaService
        .update(this.categoriaEditandoId, data)
        .subscribe({
          next: () => {
            const index = this.categorias.findIndex(
              c => c.categoriaId === this.categoriaEditandoId
            );

            this.categorias[index] = {
              ...this.categorias[index],
              ...data
            };

            this.cancelarEdicion();
          },
          error: err => {
            this.errorCategoria = err.error;
            this.erroresBackend = err.error;
          }
        });
    } else {
      // Flujo de creación (POST)
      this.categoriaService.create(data).subscribe({
        next: (categoriaCreada) => {
          this.categorias.push(categoriaCreada);
          this.categoriaForm.reset({ activo: true });
        },
        error: err => {
          this.errorCategoria = err.error;
          this.erroresBackend = err.error;

        }

      });
    }
  }

  // Prepara el formulario con los datos de la fila seleccionada para editar

  editarCategoria(categoria: Categoria) {
    this.categoriaEditandoId = categoria.categoriaId;

    this.categoriaForm.patchValue({
      nombre: categoria.nombre,
      activo: categoria.activo
    });
  }
  cancelarEdicion() {
    this.categoriaEditandoId = null;
    this.categoriaForm.reset({ activo: true });
  }
  eliminarCategoria(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;

    this.categoriaService.delete(id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(c => c.categoriaId !== id);
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  cargarProductos() {
    this.productoService.getAll().subscribe({
      next: (res: Producto[]) => {
        this.productos = res;
        this.cdr.detectChanges();
      },
      error: err => {
        this.erroresBackend = err.error;
      }
    });
  }

  // --- LÓGICA DE PRODUCTOS ---

  guardarProducto() {
    this.errorProducto = null;

    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const data = this.productoForm.value;

    if (this.productoEditandoId) {
      // EDITAR
      this.productoService
        .update(this.productoEditandoId, data)
        .subscribe({
          next: () => {
            const index = this.productos.findIndex(
              p => p.productoId === this.productoEditandoId
            );

            this.productos[index] = {
              ...this.productos[index],
              ...data
            };

            this.cancelarEdicionProducto();
            this.cdr.detectChanges();
          },
          error: err => {
            this.erroresBackend = err.error;
          }
        });

    } else {
      // CREAR
      this.productoService.create(data).subscribe({
        next: () => {
          this.cargarProductos();
          this.productoForm.reset({ activo: true });
        },
        error: err => {
          this.erroresBackend = err.error;
        }
      });
    }
  }

  editarProducto(producto: Producto) {
    this.productoEditandoId = producto.productoId;

    this.productoForm.patchValue({
      nombre: producto.nombre,
      precio: producto.precio,
      categoriaId: producto.categoriaId,
      activo: producto.activo
    });
  }

  cancelarEdicionProducto() {
    this.productoEditandoId = null;
    this.productoForm.reset({ activo: true });
  }

  eliminarProducto(id: number) {
    if (!confirm('¿Eliminar producto?')) return;

    this.productoService.delete(id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.productoId !== id);
        this.cdr.detectChanges();
      },
      error: err => {
        this.erroresBackend = err.error;
      }
    });

  }

  crearCategoriaForm() {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      activo: [true]
    });
  }

  crearProductoForm() {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(1)]],
      categoriaId: [null, Validators.required],
      activo: [true]
    });
  }

  irVentas() {
    this.router.navigate(['/ventas-admin']);
  }

  irReportes() {
    this.router.navigate(['/reportes']);
  }

  irDashboard() { this.router.navigate(['/dashboard']); }
}
