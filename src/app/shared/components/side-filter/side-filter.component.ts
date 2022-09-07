import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomersService } from 'src/app/features/customers/services/customer/customers.service';

@Component({
  selector: 'app-side-filter',
  templateUrl: './side-filter.component.html',
  styleUrls: ['./side-filter.component.css'],
})
export class SideFilterComponent implements OnInit {
 

  @Input() filterTitle!: string;
  searchForm!: FormGroup;
  @Output() filteredData: any = new EventEmitter();
  phoneMask: any = [
    '(',
    /[1-9]/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  constructor(
    private formBuilder: FormBuilder,
    private customersService: CustomersService
  ) {}

  ngOnInit(): void {
    this.createSearchForm();
  }

  createSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      nationalityId: [''],
      customerId: [''],
      accountNumber: [''],
      gsmNumber: [''],
      firstName: [''],
      lastName: [''],
      orderNumber: [''],
    });
  }

  search() {
    let nationalityId = parseInt(this.searchForm.value.nationalityId);
    const newSearchForm = {
      ...this.searchForm.value,
      nationalityId: nationalityId,
    };
    console.log(this.searchForm.value.gsmNumber);
    this.customersService.getListByFilter(newSearchForm).subscribe((data) => {
      this.filteredData.emit(data);
    });
  }
  clear() {
    this.createSearchForm();
  }

  isNumberId(event: any): boolean {
   
    const pattern = /[0-9]/;
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (pattern.test(char)) return true;

    event.preventDefault();
    return false;
  }
}
