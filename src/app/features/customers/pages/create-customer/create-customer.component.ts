import { map, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';
import { Router } from '@angular/router';
import { CustomerDemographicInfo } from '../../models/customerDemographicInfo';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  profileForm!: FormGroup;
  createCustomerModel$!: Observable<Customer>;
  customer!: Customer;
  isShow: Boolean = false;
  now: Date = new Date();
  min: Date = new Date(
    this.now.getFullYear() - 18,
    this.now.getMonth(),
    this.now.getDate() - 1
  );
  get minDateInput() {
    let month = this.min.getMonth() + 1;
    let day = this.min.getDate();
    return `${this.min.getFullYear()}-${month > 10 ? month : `0${month}`}-${
      day > 10 ? day : `0${day}`
    }`;
  }
  // minDate = '2004-01-01';

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private customerService: CustomersService,
    private router: Router
  ) {
    this.createCustomerModel$ = this.customerService.customerToAddModel$;
  }

  ngOnInit(): void {
    this.createCustomerModel$.subscribe((state) => {
      this.customer = state;
      this.createFormAddCustomer();
    });
  }

  createFormAddCustomer() {
    this.profileForm = this.formBuilder.group({
      firstName: [this.customer.firstName, Validators.required],
      middleName: [this.customer.middleName],
      lastName: [this.customer.lastName, Validators.required],
      birthDate: [this.customer.birthDate, Validators.required],
      gender: [this.customer.gender ?? '', Validators.required],
      fatherName: [this.customer.fatherName],
      motherName: [this.customer.motherName],
      nationalityId: [
        this.customer.nationalityId,
        [Validators.pattern('^[0-9]{11}$'), Validators.required],
      ],
    });
  }

  // goNextPage() {
  //   if (this.profileForm.valid) {
  //     this.isShow = false;
  //     this.customerService.setDemographicInfoToStore(this.profileForm.value);
  //     this.router.navigateByUrl('/dashboard/customers/list-address-info');
  //   } else {
  //     this.isShow = true;
  //   }
  // }

  get nationalId() {
    return this.profileForm.get('nationalityId');
  }
  isNumber(event: any): boolean {
    console.log(event);
    const pattern = /[0-9]/;
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (pattern.test(char)) return true;

    event.preventDefault();
    return false;
  }

  isBirthDayValid(event: any): boolean {
    if (!event.target.value) return true;

    const inputDate: Date = new Date(event.target.value);
    const isValid: boolean =
      new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ).getTime() <= this.min.getTime();

    if (!isValid) {
      this.messageService.add({
        detail: 'A Customer Is Already Exist With This Nationality ID',
        severity: 'info',
        summary: 'Warning!',
        key: 'etiya-custom',
        sticky: true,
      });
    }

    return true;
  }

  getCustomers(id: number) {
    this.customerService.getList().subscribe((response) => {
      response.filter((item) => {
        if (item.nationalityId === id) {
          this.messageService.add({
            detail: 'A Customer Is Already Exist With This Nationality ID',
            severity: 'info',
            summary: 'Warning!',
            key: 'etiya-custom',
            sticky: true,
          });
          this.router.navigateByUrl('/dashboard/customers/create-customer');
        }
      });
    });
  }

  goNextPage() {
    if (this.profileForm.valid) {
      this.isShow = false;
      this.getCustomers(this.profileForm.value.nationalityId);
    } else {
      this.isShow = true;
    }
  }
}
