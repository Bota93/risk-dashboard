import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OperationService } from '../../../core/services/operation';

@Component({
  selector: 'app-operation-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './operation-list.html',
  styleUrl: './operation-list.scss',
})
export class OperationList {
  constructor(public operationService: OperationService) {}

  deleteOperation(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this operation?');

    if (!confirmed) {
      return;
    }

    this.operationService.deleteOperation(id);
  }
}
