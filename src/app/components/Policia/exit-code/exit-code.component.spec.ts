import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitCodeComponent } from './exit-code.component';

describe('ExitCodeComponent', () => {
  let component: ExitCodeComponent;
  let fixture: ComponentFixture<ExitCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
