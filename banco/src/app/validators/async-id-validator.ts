// src/app/validators/async-id-validator.ts
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export function uniqueProductIdValidator(apiService: ApiService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return apiService.verifyProductId(control.value).pipe(
      map(isTaken => (isTaken ? { idTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}
