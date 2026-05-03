import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Operation } from '../../core/models/operation.model';
import { OperationService } from '../../core/services/operation';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  const operations = signal<Operation[]>([]);

  const operationServiceMock: Pick<OperationService, 'operations'> = {
    operations: operations.asReadonly(),
  };

  beforeEach(async () => {
    operations.set([]);

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        { provide: OperationService, useValue: operationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show zeroed metrics when there are no operations', () => {
    const metricValues = Array.from(
      fixture.nativeElement.querySelectorAll('strong'),
      (element: HTMLElement) => element.textContent?.trim()
    );

    expect(component.total()).toBe(0);
    expect(component.pending()).toBe(0);
    expect(component.approved()).toBe(0);
    expect(component.rejected()).toBe(0);
    expect(component.highRisk()).toBe(0);
    expect(metricValues).toEqual(['0', '0', '0', '0', '0']);
  });

  it('should compute and render metrics from operations', () => {
    operations.set([
      {
        id: '1',
        clientName: 'Acme',
        amount: 1000,
        status: 'Pending',
        riskLevel: 'High',
        description: 'Bridge loan',
        createdAt: '2026-05-03T10:00:00.000Z',
      },
      {
        id: '2',
        clientName: 'Globex',
        amount: 2500,
        status: 'Approved',
        riskLevel: 'Medium',
        description: 'Expansion credit',
        createdAt: '2026-05-03T11:00:00.000Z',
      },
      {
        id: '3',
        clientName: 'Initech',
        amount: 500,
        status: 'Rejected',
        riskLevel: 'High',
        description: 'Short-term line',
        createdAt: '2026-05-03T12:00:00.000Z',
      },
    ]);
    fixture.detectChanges();

    const metricValues = Array.from(
      fixture.nativeElement.querySelectorAll('strong'),
      (element: HTMLElement) => element.textContent?.trim()
    );

    expect(component.total()).toBe(3);
    expect(component.pending()).toBe(1);
    expect(component.approved()).toBe(1);
    expect(component.rejected()).toBe(1);
    expect(component.highRisk()).toBe(2);
    expect(metricValues).toEqual(['3', '1', '1', '1', '2']);
  });
});
