import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Product } from "../../models/product";
import { ApiService } from "../../services/api.service";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import {CustomValidators} from "../../validators/custom.validator";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, DatePipe, ConfirmDialogComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isEditMode: boolean = false;
  productId: string | null = null;
  showInfoModal: boolean = false;
  infoMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, CustomValidators.dateGreaterThanOrEqualToday()]],
      date_revision: [{ value: '', disabled: true }, Validators.required]
    });

    this.productForm.get('date_release')?.valueChanges.subscribe(() => {
      this.updateDateRevisionValidators();
      if (this.productForm.get('date_release')?.valid) {
        this.productForm.get('date_revision')?.enable();
      } else {
        this.productForm.get('date_revision')?.disable();
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = id;
        const product = history.state.product as Product;
        console.log(product);
        if (product) {
          product.date_release = this.datePipe.transform(product.date_release, 'yyyy-MM-dd') || '';
          product.date_revision = this.datePipe.transform(product.date_revision, 'yyyy-MM-dd') || '';
          this.productForm.patchValue(product);
          this.updateDateRevisionValidators();
        } else {
          this.errorMessage = 'No se pudo cargar el producto para edición.';
        }
      }
    });
  }

  private updateDateRevisionValidators(): void {
    const dateReleaseControl = this.productForm.get('date_release');
    const dateRevisionControl = this.productForm.get('date_revision');
    if (dateRevisionControl && dateReleaseControl) {
      dateRevisionControl.setValidators([Validators.required, CustomValidators.dateOneYearAfter(dateReleaseControl)]);
      dateRevisionControl.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData: Product = this.productForm.value;
      console.log(productData);
      if (this.isEditMode && this.productId) {
        this.apiService.updateProduct(productData).subscribe(
          response => {
            this.infoMessage = 'Producto actualizado exitosamente';
            this.successMessage = 'Producto actualizado exitosamente';
            this.showInfoModal = true;
            this.errorMessage = null;
          },
          error => {
            this.infoMessage = 'Hubo un error al actualizar el producto. Inténtalo de nuevo más tarde.';
            this.showInfoModal = true;
            this.successMessage = null;
          }
        );
      } else {
        this.apiService.verifyProductId(productData.id).subscribe(
          isTaken => {
            if (isTaken) {
              this.infoMessage = 'El Id del producto ya existe intente con otro Id.';
              this.showInfoModal = true;
              this.successMessage = null;
              this.productForm.reset();
              return;
            }
          }
        );
        this.apiService.createProduct(productData).subscribe(
          response => {
            this.infoMessage = 'Producto creado exitosamente';
            this.showInfoModal = true;
            this.errorMessage = null;
            this.successMessage = 'Producto creado exitosamente';
            this.productForm.reset();
          },
          error => {
            this.infoMessage = 'Hubo un error al crear el producto. Inténtalo de nuevo más tarde.';
            this.showInfoModal = true;
            this.successMessage = null;
          }
        );
      }
    }
  }

  onReset(): void {
    this.productForm.reset();
  }

  closeInfoModal(): void {
    this.showInfoModal = false;
    this.infoMessage = '';
    if (this.successMessage) {
      this.router.navigate(['/']);
    }
  }
}
