import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  private route = inject(ActivatedRoute);

  private operationId = this.route.snapshot.paramMap.get('id');

  isEditMode = computed(() => Boolean(this.operationId));

  form = this.fb.nonNullable.group({
    clientName: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    status: ['Pending' as OperationStatus],
    riskLevel: ['Low' as RiskLevel],
    description: [''],
  });

  constructor() {
    if (!this.operationId) return;

    const operation = this.operationService.getOperationById(this.operationId);

    if (!operation) return;

    this.form.patchValue({
      clientName: operation.clientName,
      amount: operation.amount,
      status: operation.status,
      riskLevel: operation.riskLevel,
      description: operation.description,
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    if (this.operationId) {
      this.operationService.updateOperation(this.operationId, formValue);
    } else {
      this.operationService.addOperation(formValue);
    }

    this.router.navigate(['/operations']);
  }
}
