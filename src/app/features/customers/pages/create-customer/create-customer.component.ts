import { map, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  profileForm!: FormGroup;
  createCustomerModel$!: Observable<Customer>;
  customer!: Customer;
  isShow: Boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private router: Router
  ) {
    this.createCustomerModel$ = this.customerService.customerToAddModel$;
  }

  ngOnInit(): void {
    this.createCustomerModel$.subscribe((state) => {
      this.customer = state;
      this.createFormUpdateCustomer();
    });
  }

  createFormUpdateCustomer() {
    this.profileForm = this.formBuilder.group({
      firstName: [this.customer.firstName, Validators.required],
      middleName: [this.customer.middleName],
      lastName: [this.customer.lastName, Validators.required],
      birthDate: [
        this.customer.birthDate,
        [Validators.required],

        // { validator: this.ageCheck('birthDate') },
      ],
      gender: [this.customer.gender || '', Validators.required],
      fatherName: [this.customer.fatherName],
      motherName: [this.customer.motherName],
      nationalityId: [
        this.customer.nationalityId,
        [Validators.pattern('^[0-9]{11}$'), Validators.required],
      ],
    });
  }
  isNumber(event: any): boolean {
    console.log(event);
    const pattern = /[0-9]/;
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (pattern.test(char)) return true;

    event.preventDefault();
    return false;
  }
  goNextPage() {
    if (this.profileForm.valid) {
      this.isShow = false;
      this.customerService.setDemographicInfoToStore(this.profileForm.value);
      this.router.navigateByUrl('/dashboard/customers/list-address-info');
    } else {
      this.isShow = true;
    }
  }

  // getAge(date: string): number {
  //   let today = new Date();
  //   let birthDate = new Date(date);
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   let month = today.getMonth() - birthDate.getMonth();
  //   if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //     console.log(age, 'birthdate', birthDate);
  //   }
  //   return age;
  // }
  // ageCheck(controlName: string): ValidatorFn {
  //   return (controls: AbstractControl) => {
  //     const control = controls.get(controlName);

  //     if (control?.errors && !control.errors['under18']) {
  //       return null;
  //     }
  //     if (this.getAge(control?.value) <= 18) {
  //       return { under18: true };
  //     } else {
  //       return null;
  //     }
  //   };
  // }
}
