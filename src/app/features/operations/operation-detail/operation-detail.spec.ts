import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { OperationService } from '../../../core/services/operation';
import { OperationDetail } from './operation-detail';

describe('OperationDetail', () => {
  let component: OperationDetail;
  let fixture: ComponentFixture<OperationDetail>;
  let operationService: Pick<OperationService, 'getOperationById'>;

  beforeEach(async () => {
    operationService = {
      getOperationById: vi.fn().mockReturnValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [OperationDetail],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'op-1' }),
            },
          },
        },
        { provide: OperationService, useValue: operationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request the operation from the service using the route id', () => {
    component.operation();

    expect(operationService.getOperationById).toHaveBeenCalledWith('op-1');
  });
});
