import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtGridComponent } from './art-grid.component';

describe('ArtGridComponent', () => {
  let component: ArtGridComponent;
  let fixture: ComponentFixture<ArtGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
