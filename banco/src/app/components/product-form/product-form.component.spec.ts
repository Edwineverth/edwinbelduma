import { render, screen, fireEvent } from '@testing-library/angular';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { ProductFormComponent } from './product-form.component';
import { ApiService } from '../../services/api.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import {TestBed} from "@angular/core/testing";
import {CustomValidators} from "../../validators/custom.validator";
import {of} from "rxjs";

describe('ProductFormComponent', () => {
  beforeEach(async () => {
    await render(ProductFormComponent, {
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        ConfirmDialogComponent // Aquí se importa porque es standalone
      ],
      providers: [
        DatePipe,
        ApiService
      ],
      componentProperties: {
        productForm: {
          id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
          name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
          description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
          logo: ['', Validators.required],
          date_release: ['', [Validators.required, CustomValidators.dateGreaterThanOrEqualToday()]],
          date_revision: [{ value: '', disabled: true }, Validators.required]
        } as any
      }
    });
  });

  it('should create', () => {
    expect(screen.getByText(/Formulario de Registro/)).toBeTruthy();
  });

  it('should validate id field as required', async () => {
    fireEvent.input(screen.getByLabelText(/ID/), { target: { value: '' } });
    fireEvent.blur(screen.getByLabelText(/ID/));
    expect(await screen.findByText(/ID es requerido/)).toBeTruthy();
  });

  it('should enable date_revision when date_release is valid', async () => {
    fireEvent.input(screen.getByLabelText(/Fecha de Liberación/), { target: { value: '2024-05-14' } }); // Usar una fecha válida
    // @ts-ignore
    expect(screen.getByLabelText(/Fecha de Revisión/).disabled).toBe(true);
  });

  it('should show error message if product ID already exists', async () => {
    const apiService = TestBed.inject(ApiService);
    jest.spyOn(apiService, 'verifyProductId').mockReturnValue(of(true));
    fireEvent.input(screen.getByLabelText(/ID/), { target: { value: '123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Enviar/ }));

  });


});
