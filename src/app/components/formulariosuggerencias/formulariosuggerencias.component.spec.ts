import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariosuggerenciasComponent } from './formulariosuggerencias.component';

describe('FormulariosuggerenciasComponent', () => {
  let component: FormulariosuggerenciasComponent;
  let fixture: ComponentFixture<FormulariosuggerenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulariosuggerenciasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormulariosuggerenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
