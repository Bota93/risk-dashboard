import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { OperationService } from '../../../core/services/operation';
import { OperationForm } from './operation-form';

describe('OperationForm', () => {
  let component: OperationForm;
  let fixture: ComponentFixture<OperationForm>;
  let operationService: Pick<OperationService, 'addOperation'>;
  let router: Router;

  beforeEach(async () => {
    operationService = {
      addOperation: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OperationForm],
      providers: [
        provideRouter([]),
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
});
