import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSinistreComponent } from './image-sinistre.component';

describe('ImageSinistreComponent', () => {
  let component: ImageSinistreComponent;
  let fixture: ComponentFixture<ImageSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageSinistreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
