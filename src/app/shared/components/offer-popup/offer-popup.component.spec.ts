import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPopupComponent } from './offer-popup.component';

describe('OfferPopupComponent', () => {
  let component: OfferPopupComponent;
  let fixture: ComponentFixture<OfferPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
