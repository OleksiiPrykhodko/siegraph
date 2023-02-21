import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphAccordionComponent } from './graph-accordion.component';

describe('GraphAccordionComponent', () => {
  let component: GraphAccordionComponent;
  let fixture: ComponentFixture<GraphAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphAccordionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
