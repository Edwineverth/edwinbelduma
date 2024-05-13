import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule,HttpClientModule, ReactiveFormsModule, ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  @Input() product: Product | null = null;
  @Output() save = new EventEmitter<void>();
  form: FormGroup;
  isEdit: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });

  }

  ngOnChanges(): void {
    if (this.product) {
      this.isEdit = true;
      this.form.patchValue(this.product);
      this.form.get('id')?.disable();
    } else {
      this.isEdit = false;
      this.form.reset();
      this.form.get('id')?.enable();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const product = this.form.value;
    if (this.isEdit) {
      this.apiService.updateProduct(product).subscribe(() => this.save.emit());
    } else {
      this.apiService.verifyProductId(product.id).subscribe(isValid => {
        if (isValid) {
          this.apiService.createProduct(product).subscribe(() => this.save.emit());
        } else {
          this.form.get('id')?.setErrors({ idExists: true });
        }
      });
    }
  }
}
