import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphAccordionAggregatorComponent } from './graph-accordion-aggregator.component';

describe('GraphAccordionAggregatorComponent', () => {
  let component: GraphAccordionAggregatorComponent;
  let fixture: ComponentFixture<GraphAccordionAggregatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphAccordionAggregatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphAccordionAggregatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
