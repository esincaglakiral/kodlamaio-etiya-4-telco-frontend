import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  selector: 'app-add-contact-medium',
  templateUrl: './add-contact-medium.component.html',
  styleUrls: ['./add-contact-medium.component.css'],
})
export class AddContactMediumComponent implements OnInit {
  contactForm!: FormGroup;
  customer!: Customer;
  isShow!: boolean;
  constructor(
    private customersService: CustomersService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.customersService.customerToAddModel$.subscribe((state) => {
      this.customer = state;
      this.createFormContactMedium();
    });
  }
  createFormContactMedium() {
    this.contactForm = this.formBuilder.group({
      email: [
        this.customer.contactMedium?.email,
        [Validators.email, Validators.required],
      ],
      homePhone: [this.customer.contactMedium?.homePhone],
      mobilePhone: [
        this.customer.contactMedium?.mobilePhone,
        Validators.required,
      ],
      fax: [this.customer.contactMedium?.fax],
    });
  }

  goToPreviousPage() {
    this.saveContactMediumToStore();
    this.router.navigateByUrl('/dashboard/customers/list-address-info');
  }

  saveContactMediumToStore() {
    this.customersService.setContactMediumInfoToStore(this.contactForm.value);
  }

  saveCustomer() {
    if (this.contactForm.valid) {
      this.saveContactMediumToStore();
      this.customersService.add(this.customer).subscribe({
        next: (data) => {
          this.messageService.add({
            detail: 'Sucsessfully added',
            severity: 'success',
            summary: 'Add',
            key: 'etiya-custom',
          });
          this.router.navigateByUrl('/dashboard/customers/customer-dashboard');
        },
        error: (err) => {
          this.messageService.add({
            detail: 'Error created',
            severity: 'danger',
            summary: 'Error',
            key: 'etiya-custom',
          });
        },
      });
    } else {
      this.isShow = true;
    }
  }
  isNumber(event: any): boolean {
    const pattern = /[0-9]/;
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (pattern.test(char)) return true;

    event.preventDefault();
    return false;
  }
}
