import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportExpertiseComponent } from './rapport-expertise.component';

describe('RapportExpertiseComponent', () => {
  let component: RapportExpertiseComponent;
  let fixture: ComponentFixture<RapportExpertiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportExpertiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RapportExpertiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
