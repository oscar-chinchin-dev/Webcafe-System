import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierresAdminComponent } from './cierres.admin.component';

describe('CierresAdminComponent', () => {
  let component: CierresAdminComponent;
  let fixture: ComponentFixture<CierresAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CierresAdminComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CierresAdminComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
