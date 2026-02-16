import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasReportesComponent } from './ventas.reportes.component';

describe('VentasReportes', () => {
  let component: VentasReportesComponent;
  let fixture: ComponentFixture<VentasReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasReportesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VentasReportesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
