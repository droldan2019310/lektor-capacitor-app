import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsPendingComponent } from './documents-pending.component';

describe('DocumentsPendingComponent', () => {
  let component: DocumentsPendingComponent;
  let fixture: ComponentFixture<DocumentsPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
