import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevanceChartComponent } from './relevance-chart.component';

describe('RelevanceChartComponent', () => {
  let component: RelevanceChartComponent;
  let fixture: ComponentFixture<RelevanceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelevanceChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelevanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
