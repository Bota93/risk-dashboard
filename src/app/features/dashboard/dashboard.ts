import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OperationService } from '../../core/services/operation';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private operationService = inject(OperationService);

  operations = this.operationService.operations;

  total = computed(() => this.operations().length);

  pending = computed(() =>
    this.operations().filter(op => op.status === 'Pending').length
  );

  approved = computed(() =>
    this.operations().filter(op => op.status === 'Approved').length
  );

  rejected = computed(() =>
    this.operations().filter(op => op.status === 'Rejected').length
  );

  highRisk = computed(() =>
    this.operations().filter(op => op.riskLevel === 'High').length
  );
}
