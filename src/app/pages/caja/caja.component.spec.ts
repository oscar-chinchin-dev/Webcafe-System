import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaComponent } from './caja.component';

describe('CajaComponent', () => {
  let component: CajaComponent;
  let fixture: ComponentFixture<CajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CajaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
