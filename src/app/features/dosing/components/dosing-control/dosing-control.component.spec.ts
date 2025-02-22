import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosingControlComponent } from './dosing-control.component';

describe('DosingControlComponent', () => {
  let component: DosingControlComponent;
  let fixture: ComponentFixture<DosingControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DosingControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DosingControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
