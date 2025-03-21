import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisSinistreComponent } from './devis-sinistre.component';

describe('DevisSinistreComponent', () => {
  let component: DevisSinistreComponent;
  let fixture: ComponentFixture<DevisSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevisSinistreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevisSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
