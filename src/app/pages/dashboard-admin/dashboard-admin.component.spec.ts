import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgForm } from '@angular/forms';
import { SuggestionBoxComponent } from './dashboard-admin.component';

describe('DashboardAdminComponent', () => {
  let component: SuggestionBoxComponent;
  let fixture: ComponentFixture<SuggestionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionBoxComponent,NgForm]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuggestionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
