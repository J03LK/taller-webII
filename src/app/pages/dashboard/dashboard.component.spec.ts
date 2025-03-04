import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { Router } from 'express';
import { RouterModule } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent,RouterModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct priority class', () => {
    expect(component.getPriorityClass('high')).toBe('high');
    expect(component.getPriorityClass('medium')).toBe('medium');
    expect(component.getPriorityClass('low')).toBe('low');
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('Pendiente')).toBe('bg-secondary');
    expect(component.getStatusClass('En revisión')).toBe('bg-warning text-dark');
    expect(component.getStatusClass('Implementada')).toBe('bg-success');
    expect(component.getStatusClass('Rechazada')).toBe('bg-danger');
    expect(component.getStatusClass('Otro')).toBe('bg-secondary');
  });

  it('should filter suggestions correctly', () => {
    const pendingSuggestion = {
      id: 1,
      title: 'Test',
      description: 'Test',
      author: 'Test',
      department: 'Test',
      date: new Date(),
      status: 'Pendiente',
      priority: 'high'
    };

    component.filterStatus = '';
    expect(component.filterSuggestions(pendingSuggestion)).toBe(true);

    component.filterStatus = 'pending';
    expect(component.filterSuggestions(pendingSuggestion)).toBe(true);

    component.filterStatus = 'in-review';
    expect(component.filterSuggestions(pendingSuggestion)).toBe(false);
  });
});