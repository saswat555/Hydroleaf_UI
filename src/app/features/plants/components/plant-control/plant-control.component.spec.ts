import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantControlComponent } from './plant-control.component';

describe('PlantControlComponent', () => {
  let component: PlantControlComponent;
  let fixture: ComponentFixture<PlantControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
