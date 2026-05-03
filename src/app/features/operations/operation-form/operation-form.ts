import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OperationService } from '../../../core/services/operation';
import { OperationStatus, RiskLevel } from '../../../core/models/operation.model';

@Component({
  selector: 'app-operation-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './operation-form.html',
  styleUrl: './operation-form.scss',
})
export class OperationForm {
  private fb = inject(FormBuilder);
  private operationService = inject(OperationService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    clientName: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    status: ['Pending' as OperationStatus],
    riskLevel: ['Low' as RiskLevel],
    description: [''],
  });

  submit(): void {
    if (this.form.invalid) return;

    this.operationService.addOperation(this.form.getRawValue());
    this.router.navigate(['/operations']);
  }
}
