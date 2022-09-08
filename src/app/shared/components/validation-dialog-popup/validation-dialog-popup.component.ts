import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-validation-dialog-popup',
  templateUrl: './validation-dialog-popup.component.html',
  styleUrls: ['./validation-dialog-popup.component.css']
})
export class ValidationDialogPopupComponent implements OnInit {

  constructor(private messageService:MessageService) { }

  ngOnInit(): void {
  }

  Clear() {
    this.messageService.clear();
  }

}
