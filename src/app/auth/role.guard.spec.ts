import { TestBed } from '@angular/core/testing';
import { roleGuard } from './role.guard';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('roleGuard', () => {
  let guard: roleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        roleGuard,
        { provide: AuthService, useValue: {} },
        { provide: Router, useValue: {} }
      ]
    });

    guard = TestBed.inject(roleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
