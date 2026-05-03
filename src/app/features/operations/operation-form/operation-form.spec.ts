import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
  Router,
} from '@angular/router';
import { vi } from 'vitest';

import { OperationService } from '../../../core/services/operation';
import { OperationForm } from './operation-form';

describe('OperationForm', () => {
  let component: OperationForm;
  let fixture: ComponentFixture<OperationForm>;
  let operationService: Pick<
    OperationService,
    'addOperation' | 'updateOperation' | 'getOperationById'
  >;
  let router: Router;
  let routeId: string | null;

  beforeEach(async () => {
    routeId = null;

    operationService = {
      addOperation: vi.fn(),
      updateOperation: vi.fn(),
      getOperationById: vi.fn().mockReturnValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [OperationForm],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              get paramMap() {
                return convertToParamMap(routeId ? { id: routeId } : {});
              },
            },
          },
        },
        { provide: OperationService, useValue: operationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationForm);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep submit button disabled when form is invalid', () => {
    component.form.controls.clientName.setValue('');
    component.form.controls.amount.setValue(0);
    fixture.detectChanges();

    const submitButton: HTMLButtonElement = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;

    expect(component.form.invalid).toBe(true);
    expect(submitButton.disabled).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.form.controls.clientName.setValue('');
    component.form.controls.amount.setValue(0);

    component.submit();

    expect(operationService.addOperation).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should submit valid form and navigate back to operations', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.form.setValue({
      clientName: 'Acme Corp',
      amount: 1500,
      status: 'Approved',
      riskLevel: 'Medium',
      description: 'Quarterly credit line',
    });

    component.submit();

    expect(operationService.addOperation).toHaveBeenCalledWith({
      clientName: 'Acme Corp',
      amount: 1500,
      status: 'Approved',
      riskLevel: 'Medium',
      description: 'Quarterly credit line',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/operations']);
  });

  it('should load operation data in edit mode', async () => {
    routeId = 'op-42';
    operationService.getOperationById = vi.fn().mockReturnValue({
      id: 'op-42',
      clientName: 'Northwind Bank',
      amount: 2200,
      status: 'Approved',
      riskLevel: 'High',
      description: 'Existing operation',
      createdAt: '2026-05-03T10:00:00.000Z',
    });

    fixture = TestBed.createComponent(OperationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.isEditMode()).toBe(true);
    expect(operationService.getOperationById).toHaveBeenCalledWith('op-42');
    expect(component.form.getRawValue()).toEqual({
      clientName: 'Northwind Bank',
      amount: 2200,
      status: 'Approved',
      riskLevel: 'High',
      description: 'Existing operation',
    });
  });

  it('should update existing operation in edit mode', () => {
    routeId = 'op-42';
    operationService.getOperationById = vi.fn().mockReturnValue({
      id: 'op-42',
      clientName: 'Northwind Bank',
      amount: 2200,
      status: 'Approved',
      riskLevel: 'High',
      description: 'Existing operation',
      createdAt: '2026-05-03T10:00:00.000Z',
    });

    fixture = TestBed.createComponent(OperationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.form.setValue({
      clientName: 'Northwind Holdings',
      amount: 3000,
      status: 'Rejected',
      riskLevel: 'Medium',
      description: 'Updated operation',
    });

    component.submit();

    expect(operationService.updateOperation).toHaveBeenCalledWith('op-42', {
      clientName: 'Northwind Holdings',
      amount: 3000,
      status: 'Rejected',
      riskLevel: 'Medium',
      description: 'Updated operation',
    });
    expect(operationService.addOperation).not.toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/operations']);
  });
});
