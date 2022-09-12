import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-offer-popup',
  templateUrl: './offer-popup.component.html',
  styleUrls: ['./offer-popup.component.css']
})
export class OfferPopupComponent implements OnInit {

  constructor(private messageService:MessageService) { }

  ngOnInit(): void {
  }

  onConfirm() {
    this.messageService.clear();
  }
}
