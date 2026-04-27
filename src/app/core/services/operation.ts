import { Injectable, signal } from '@angular/core';
import { Operation } from '../models/operation.model';

const STORAGE_KEY = 'risk-dashboard-operations';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  private readonly operationsSignal = signal<Operation[]>(this.loadFromStorage());

  readonly operations = this.operationsSignal.asReadonly();

  addOperation(operation: Omit<Operation, 'id' | 'createdAt'>): void {
    const newOperation: Operation = {
      ...operation,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.operationsSignal.update((operations) => [...operations, newOperation]);
    this.saveToStorage();
  }

  updateOperation(
    id: string,
    updatedOperation: Omit<Operation, 'id' | 'createdAt'>
  ): void {
    this.operationsSignal.update((operations) =>
      operations.map((operation) =>
        operation.id === id
          ? { ...operation, ...updatedOperation }
          : operation
      )
    );

    this.saveToStorage();
  }

  deleteOperation(id: string): void {
    this.operationsSignal.update((operations) =>
      operations.filter((operation) => operation.id !== id)
    );

    this.saveToStorage();
  }

  getOperationById(id: string): Operation | undefined {
    return this.operationsSignal().find((operation) => operation.id === id);
  }

  private loadFromStorage(): Operation[] {
    const storedOperations = localStorage.getItem(STORAGE_KEY);

    if (!storedOperations) {
      return [];
    }

    return JSON.parse(storedOperations) as Operation[];
  }

  private saveToStorage(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.operationsSignal())
    );
  }
}