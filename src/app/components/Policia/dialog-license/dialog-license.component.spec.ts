import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLicenseComponent } from './dialog-license.component';

describe('DialogLicenseComponent', () => {
  let component: DialogLicenseComponent;
  let fixture: ComponentFixture<DialogLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLicenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
