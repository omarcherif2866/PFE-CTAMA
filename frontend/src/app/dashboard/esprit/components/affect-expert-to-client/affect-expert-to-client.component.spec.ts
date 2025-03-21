import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectExpertToClientComponent } from './affect-expert-to-client.component';

describe('AffectExpertToClientComponent', () => {
  let component: AffectExpertToClientComponent;
  let fixture: ComponentFixture<AffectExpertToClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffectExpertToClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AffectExpertToClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
