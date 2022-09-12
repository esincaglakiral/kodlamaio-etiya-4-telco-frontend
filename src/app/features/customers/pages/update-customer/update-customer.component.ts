import { formatDate } from '@angular/common';
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

  isShow: Boolean = false;
  nationalityId: Boolean = false;
  today: Date = new Date();
  under18: Boolean = false;
  futureDate: Boolean = false;
  maxDate = new Date();

  isBirthDate: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.maxDate.setFullYear(new Date().getFullYear() - 18);
  }

  ngOnInit(): void {
    this.getCustomerById();
    this.messageService.clearObserver.subscribe((data) => {
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

  isBirthdayValid(event: any): boolean {
    const now = new Date();
    const inputDate = new Date(event.target.value);
    if (
      inputDate.getTime() -
        new Date(
          now.getFullYear() - 18,
          now.getMonth(),
          now.getDay()
        ).getTime() >=
      0
    )
      return true;
    console.log('18 den büyük');
    event.preventDefault();
    return false;
  }
  createFormUpdateCustomer() {
    console.log(this.customer.birthDate);
    let bDate = new Date();
    if (this.customer.birthDate) {
      bDate = new Date(this.customer.birthDate);
    }
    this.updateCustomerForm = this.formBuilder.group({
      firstName: [this.customer.firstName, Validators.required],
      middleName: [this.customer.middleName],
      lastName: [this.customer.lastName, Validators.required],
      birthDate: [
        formatDate(new Date(bDate), 'yyyy-MM-dd', 'en'),
        Validators.required,
      ],
      gender: [this.customer.gender, Validators.required],
      fatherName: [this.customer.fatherName],
      motherName: [this.customer.motherName],
      nationalityId: [
        this.customer.nationalityId,
        [Validators.pattern('^[0-9]{11}$'), Validators.required],
      ],
    });
  }
  onDateChange(event: any) {
    this.isBirthDate = false;
    let date = new Date(event.target.value);
    if (
      date.getFullYear() > this.maxDate.getFullYear() ||
      (date.getMonth() > this.maxDate.getMonth() &&
        date.getDate() > this.maxDate.getDate() &&
        date.getFullYear() > this.maxDate.getFullYear())
    ) {
      this.updateCustomerForm.get('birthDate')?.setValue('');
      this.isBirthDate = true;
    }
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

  // goNextPage() {
  //   if (this.updateCustomerForm.valid) {
  //     this.isShow = false;
  //     this.customerService.setDemographicInfoToStore(this.updateCustomerForm.value);
  //     this.router.navigateByUrl('/dashboard/customers/list-address-info');
  //   } else {
  //     this.isShow = true;
  //   }
  // }

  updateCustomer() {
    this.isShow = false;
    const customer: Customer = Object.assign(
      { id: this.customer.id },
      this.updateCustomerForm.value
    );
    this.customerService.update(customer, this.customer).subscribe(() => {
      this.router.navigateByUrl(
        `/dashboard/customers/customer-info/${customer.id}`
      );
      this.messageService.add({
        detail: 'Sucsessfully updated',
        severity: 'success',
        summary: 'Update',
        key: 'etiya-custom',
      });
    });
  }

  checkInvalid() {
    if (this.updateCustomerForm.invalid) {
      this.isShow = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Enter required fields',
        key: 'etiya-custom',
      });
      return;
    }
    let date = new Date(this.updateCustomerForm.get('birthDate')?.value);
    let age = this.today.getFullYear() - date.getFullYear();
    if (age < 18) {
      this.under18 = true;
      return;
    } else {
      this.under18 = false;
    }
    if (
      this.updateCustomerForm.value.nationalityId ===
      this.customer.nationalityId
    )
      this.updateCustomer();
    else this.checkTcNum(this.updateCustomerForm.value.nationalityId);
  }

  checkTcNum(id: number) {
    this.customerService.getList().subscribe((response) => {
      let matchCustomer = response.find((item) => {
        return item.nationalityId == id;
      });
      if (matchCustomer) {
        this.messageService.add({
          detail: 'A customer is already exist with this Nationality ID',
          key: 'etiya-custom',
        });
      } else this.updateCustomer();
    });
  }
  update() {
    this.checkInvalid();
  }

  isValid(event: any): boolean {
    console.log(event);
    const pattern = /[0-9]/;
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (pattern.test(char)) return true;

    event.preventDefault();
    return false;
  }

  get isDateChanged(): boolean {
    let value = new Date(this.updateCustomerForm.get('birthDate')?.value);
    // EN BÜYÜK TRABZON
    let birthDate = new Date();
    if (this.customer.birthDate) birthDate = new Date(this.customer.birthDate);

    return (
      birthDate.getDate() != value.getDate() ||
      birthDate.getFullYear() != value.getFullYear() ||
      birthDate.getMonth() != value.getMonth()
    );
  }
}
