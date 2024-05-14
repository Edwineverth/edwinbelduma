import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static dateGreaterThanOrEqualToday(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      const date = new Date(control.value);
      today.setHours(0, 0, 0, 0); // Para comparar solo la fecha sin la hora
      if (date < today) {
        return { dateGreaterThanOrEqualToday: true };
      }
      return null;
    };
  }

  static dateOneYearAfter(releaseDateControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const releaseDate = new Date(releaseDateControl.value);
      const revisionDate = new Date(control.value);
      const oneYearLater = new Date(releaseDate);
      oneYearLater.setFullYear(releaseDate.getFullYear() + 1);
      oneYearLater.setHours(0, 0, 0, 0); // Para comparar solo la fecha sin la hora
      revisionDate.setHours(0, 0, 0, 0); // Para comparar solo la fecha sin la hora
      if (revisionDate.getTime() !== oneYearLater.getTime()) {
        return { dateOneYearAfter: true };
      }
      return null;
    };
  }
}
