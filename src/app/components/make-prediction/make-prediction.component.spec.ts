import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePredictionComponent } from './make-prediction.component';

describe('MakePredictionComponent', () => {
  let component: MakePredictionComponent;
  let fixture: ComponentFixture<MakePredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakePredictionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakePredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
