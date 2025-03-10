import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { ocultarGuard } from './ocultar.guard';

describe('ocultarGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ocultarGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
