import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OperationService } from '../../../core/services/operation';

@Component({
  selector: 'app-operation-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './operation-detail.html',
  styleUrl: './operation-detail.scss',
})
export class OperationDetail {
  private route = inject(ActivatedRoute);
  private operationService = inject(OperationService);

  private operationId = this.route.snapshot.paramMap.get('id');

  operation = computed(() => {
    if (!this.operationId) return undefined;

    return this.operationService.getOperationById(this.operationId);
  });
}
