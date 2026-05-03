import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OperationList } from './operation-list';

describe('OperationList', () => {
  let component: OperationList;
  let fixture: ComponentFixture<OperationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
