import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionAcademicaComponent } from './seccion-academica.component';

describe('SeccionAcademicaComponent', () => {
  let component: SeccionAcademicaComponent;
  let fixture: ComponentFixture<SeccionAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionAcademicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeccionAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
