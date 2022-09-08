import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CityService } from 'src/app/features/city/services/city/city.service';
import { Address } from '../../models/address';
import { City } from '../../models/city';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';

@Component({
  selector: 'app-add-address-info',
  templateUrl: './add-address-info.component.html',
  styleUrls: ['./add-address-info.component.css'],
})
export class AddAddressInfoComponent implements OnInit {
  addressForm!: FormGroup;
  cityList!: City[];
  isShow: Boolean = false;
  createCustomerModel$!: Observable<Customer>;
  customer!: Customer;
  addressList!: Address;
  selectedAddressId!: number;

  constructor(
    private formBuilder: FormBuilder,
    private customersService: CustomersService,
    private router: Router,
    private cityService: CityService,
    private activatedRoute: ActivatedRoute
  ) {
    this.createCustomerModel$ = this.customersService.customerToAddModel$;
  }

  ngOnInit(): void {
    this.createCustomerModel$.subscribe((state) => {
      this.customer = state;
      this.getAddressList();
      this.createAddressForm();
    });
  }

  getParams() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.selectedAddressId = params['id'];
      this.getAddressListInfo();
      this.createAddressForm();
    });
  }

  createAddressForm() {
    this.addressForm = this.formBuilder.group({
      city: [
        this.addressList?.city?.id || 0,
        [Validators.required, Validators.min(1)],
      ],
      street: [this.addressList?.street || '', Validators.required],
      flatNumber: [this.addressList?.flatNumber || '', Validators.required],
      description: [this.addressList?.description || '', Validators.required],
    });
  }

  save() {
    console.log(this.selectedAddressId);
    if (this.selectedAddressId) {
      this.updateAddress();
    } else {
      this.addAddress();
    }
  }

  addAddress() {
    if (this.addressForm.valid) {
      const addressToAdd: Address = {
        ...this.addressForm.value,
        city: this.cityList.find(
          (city) => city.id == this.addressForm.value.city
        ),
      };
      this.isShow = false;
      this.customersService.addAddressInfoToStore(addressToAdd, this.customer);
      this.router.navigateByUrl('/dashboard/customers/list-address-info');
    } else {
      this.isShow = true;
    }
  }

  updateAddress() {
    if (this.addressForm.valid) {
      let addressToFind = this.customer.addresses?.find(
        (c) => c.id == this.selectedAddressId
      );
      if (addressToFind) {
        const addressToUpdate = {
          ...addressToFind,
          ...this.addressForm.value,
          city: this.cityList.find(
            (city) => city.id == this.addressForm.value.city
          ),
        };
        this.customersService.updateAddressInfoToStore(addressToUpdate);
        this.router.navigateByUrl('/dashboard/customers/list-address-info');
        this.isShow = false;
      }
    } else {
      this.isShow = true;
    }
  }

  getAddressList() {
    this.cityService.getList().subscribe((data) => {
      this.cityList = data;
      this.getParams();
    });
  }

  getAddressListInfo() {
    console.log(this.customer.addresses);
    this.customer.addresses?.forEach((address) => {
      if (address.id == this.selectedAddressId) this.addressList = address;
      this.createAddressForm();
    });
  }
}
