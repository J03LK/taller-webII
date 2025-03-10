import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabladenunciasComponent } from './tabladenuncias.component';

describe('TabladenunciasComponent', () => {
  let component: TabladenunciasComponent;
  let fixture: ComponentFixture<TabladenunciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabladenunciasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabladenunciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
