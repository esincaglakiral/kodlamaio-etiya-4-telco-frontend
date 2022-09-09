import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css'],
})
export class UpdateCustomerComponent implements OnInit {
  updateCustomerForm!: FormGroup;
  selectedCustomerId!: number;
  customer!: Customer;
  maxDate = '2004-08-08';
  isShow: Boolean = false;
  nationalityId: Boolean = false;
  under18: Boolean = false;
  futureDate: Boolean = false;
  today: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getCustomerById(); this.messageService.clearObserver.subscribe((data) => {
      if (data == 'r') {
        this.messageService.clear();
      } else if (data == 'c') {
        this.messageService.clear();
        this.router.navigateByUrl(
          '/dashboard/customers/customer-info/' + this.selectedCustomerId
        );
      }
    });

  }

  createFormUpdateCustomer() {
       console.log(this.customer.birthDate);
    let bDate = new Date();
    if (this.customer.birthDate) {
      bDate = new Date(this.customer.birthDate);
    }
    this.updateCustomerForm = this.formBuilder.group({
      firstName: [this.customer.firstName, Validators.required],
      middleName: [this.customer.middleName, Validators.required],
      lastName: [this.customer.lastName, Validators.required],
      birthDate: [this.customer.birthDate, Validators.required],
      gender: [this.customer.gender, Validators.required],
      fatherName: [this.customer.fatherName, Validators.required],
      motherName: [this.customer.motherName, Validators.required],
      nationalityId: [this.customer.nationalityId, Validators.required],
    });
  }

  getCustomerById() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = params['id'];
    });
    if (this.selectedCustomerId == undefined) {
      //toast
    } else {
      this.customerService
        .getCustomerById(this.selectedCustomerId)
        .subscribe((data) => {
          this.customer = data;
          this.createFormUpdateCustomer();
        });
    }
  }

  update() {
    if (this.updateCustomerForm.invalid) {
      this.messageService.add({
        detail: 'Please fill required areas',
        severity: 'danger',
        summary: 'Error',
        key: 'etiya-custom',
      });
      return;
    }
    const customer: Customer = Object.assign(
      { id: this.customer.id },
      this.updateCustomerForm.value
    );
    this.customerService.update(customer, this.customer).subscribe(() => {
      setTimeout(() => {
        this.router.navigateByUrl(
          `/dashboard/customers/customer-address/${customer.id}`
        );
        this.messageService.add({
          detail: 'Sucsessfully updated',
          severity: 'success',
          summary: 'Update',
          key: 'etiya-custom',
        });
      }, 1000);
    });
  }
}
