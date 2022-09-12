import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from 'src/app/features/city/services/city/city.service';
import { Address } from '../../models/address';
import { BillingAccount } from '../../models/billingAccount';
import { City } from '../../models/city';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  templateUrl: './customer-billing-account-update.component.html',
  styleUrls: ['./customer-billing-account-update.component.css'],
})
export class CustomerBillingAccountUpdateComponent implements OnInit {
  accountForm!: FormGroup;
  addressForm!: FormGroup;
  isShown: boolean = false;
  cityList!: City[];
  selectedCustomerId!: number;
  customer!: Customer;
  selectedBillingId!: number;

  billingAccount!: BillingAccount | undefined;
  isValid: boolean = false;
  isShownError: boolean = false;

  billingAdress: Address[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private customerService: CustomersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.getCityList();
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedCustomerId = Number(params['id']);
      if (params['billingId'])
        this.selectedBillingId = Number(params['billingId']);
      this.getCustomerById();
    });
  }

  getCustomerById() {
    if (this.selectedCustomerId == undefined) {
      //toast
    } else {
      this.customerService
        .getCustomerById(this.selectedCustomerId)
        .subscribe((data) => {
          this.customer = data;
          this.billingAccount = data.billingAccounts?.find((data) => {
            return data.id == this.selectedBillingId;
          });
          if (this.billingAccount) {
            this.billingAccount.addresses.forEach((data) => {
              this.billingAdress.push(data);
            });
          }
          this.createAddressForm();
          this.updateAccountForm();
        });
    }
  }

  updateAccountForm() {
    this.accountForm = this.formBuilder.group({
      accountName: [this.billingAccount?.accountName, Validators.required],
      description: [this.billingAccount?.description, Validators.required],
    });
  }

  createAddressForm() {
    this.addressForm = this.formBuilder.group({
      id: [Math.floor(Math.random() * 1000)],
      city: ['', Validators.required],
      street: ['', Validators.required],
      flatNumber: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  addNewAddressBtn() {
    this.isShown = true;
    this.createAddressForm();
  }

  getCityList() {
    this.cityService.getList().subscribe((data) => {
      this.cityList = data;
    });
  }

  addAddress() {
    if (this.addressForm.valid) {
      this.isShownError = false;
      const addressToAdd: Address = {
        ...this.addressForm.value,
        city: this.cityList.find(
          (city) => city.id == this.addressForm.value.city
        ),
      };
      this.billingAdress.push(addressToAdd);
      this.isShown = false;
    } else {
      this.isValid = false;
      this.isShownError = true;
    }
  }

  update() {
    if (this.accountForm.valid) {
      this.isValid = false;
      const billinAccountToUpdate: BillingAccount = {
        ...this.accountForm.value,
        id: this.selectedBillingId,
        addresses: this.billingAdress,
        orders: this.billingAccount?.orders,
        status: this.billingAccount?.status,
        accountNumber: this.billingAccount?.accountNumber,
      };
      if (this.billingAccount) {
        this.customerService
          .updateBillingAccount(billinAccountToUpdate, this.customer)
          .subscribe(() => {
            this.router.navigateByUrl(
              '/dashboard/customers/customer-billing-account-detail/' +
                this.selectedCustomerId
            );
          });
      }
    } else {
      this.isShownError = false;
      this.isValid = true;
    }
  }

  goToPreviousPage() {
    this.router.navigateByUrl(
      '/dashboard/customers/customer-billing-account-detail/' +
        this.selectedCustomerId
    );
  }
}