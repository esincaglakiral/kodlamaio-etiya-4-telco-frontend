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
  nationalityId: Boolean = false;
  maxDate = '2004-08-08';
  today: Date = new Date();
  under18: Boolean = false;
  futureDate: Boolean = false;

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

    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'r') {
        this.messageService.clear();
      } else if (data == 'c') {
        this.messageService.clear();
        this.router.navigateByUrl('/dashboard/customers/customer-dashboard');
      }
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
  updateCustomer() {
    this.isShow = false;
    const customer: Customer = Object.assign(
      { id: this.customer.id },
      this.profileForm.value
    );
    this.customerService.update(customer, this.customer).subscribe(() => {
      this.router.navigateByUrl(`/dashboard/customers/create-customer`);
      this.messageService.add({
        detail: 'Sucsessfully updated',
        severity: 'success',
        summary: 'Update',
        key: 'etiya-custom',
      });
    });
  }
  onDateChange(event: any) {
    let date = new Date(event.target.value);
    if (date.getFullYear() > this.today.getFullYear()) {
      this.profileForm.get('birthDate')?.setValue('');
      this.futureDate = true;
    } else {
      this.futureDate = false;
    }
  }
  checkInvalid() {
    if (this.profileForm.invalid) {
      this.isShow = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Enter required fields',
        key: 'etiya-custom',
      });
      return;
    }
    let date = new Date(this.profileForm.get('birthDate')?.value);
    let age = this.today.getFullYear() - date.getFullYear();
    if (age < 18) {
      this.under18 = true;
      return;
    } else {
      this.under18 = false;
    }

    if (this.profileForm.value.nationalityId === this.customer.nationalityId)
      this.updateCustomer();
    else this.checkTcNum(this.profileForm.value.nationalityId);
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

  // getCustomers(id: number) {
  //   this.customerService.getList().subscribe((response) => {
  //     response.filter((item) => {
  //       if (item.nationalityId === id) {
  //         this.messageService.add({
  //           detail: 'a customer is already exist',
  //           severity: 'info',
  //           summary: 'Warning!',
  //           key: 'etiya-custom',
  //           sticky: true,
  //         });
  //         this.router.navigateByUrl('/dashboard/customers/create-customer');
  //       }
  //     });
  //   });
  // }

  getCustomers(id: number) {
    this.customerService.getList().subscribe((response) => {
      let matchCustomer = response.find((item) => {
        return item.nationalityId == id;
      });
      if (matchCustomer) {
        this.nationalityId = true;
      } else {
        this.nationalityId = false;
        this.customerService.setDemographicInfoToStore(this.profileForm.value);
        this.router.navigateByUrl('/dashboard/customers/list-address-info');
      }
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

  cancelChanges() {
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Your changes could not be saved. Are you sure?',
    });
  }
}
