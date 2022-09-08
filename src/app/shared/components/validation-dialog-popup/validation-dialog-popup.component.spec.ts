import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationDialogPopupComponent } from './validation-dialog-popup.component';

describe('ValidationDialogPopupComponent', () => {
  let component: ValidationDialogPopupComponent;
  let fixture: ComponentFixture<ValidationDialogPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationDialogPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationDialogPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
