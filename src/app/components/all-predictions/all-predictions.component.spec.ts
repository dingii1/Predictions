import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPredictionsComponent } from './all-predictions.component';

describe('AllPredictionsComponent', () => {
  let component: AllPredictionsComponent;
  let fixture: ComponentFixture<AllPredictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPredictionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
