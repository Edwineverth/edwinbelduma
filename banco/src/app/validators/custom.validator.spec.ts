import { FormControl } from '@angular/forms';
import {CustomValidators} from "./custom.validator";

describe('CustomValidators', () => {
  describe('dateGreaterThanOrEqualToday', () => {
    it('should return null if the date is today', () => {
      const control = new FormControl(new Date().toISOString().split('T')[0]); // Formato YYYY-MM-DD
      const validator = CustomValidators.dateGreaterThanOrEqualToday();
      expect(validator(control)).toEqual({"dateGreaterThanOrEqualToday": true});
    });

    it('should return an error object if the date is in the past', () => {
      const control = new FormControl('2000-01-01');
      const validator = CustomValidators.dateGreaterThanOrEqualToday();
      expect(validator(control)).toEqual({ dateGreaterThanOrEqualToday: true });
    });

    it('should return null if the date is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Fecha mañana
      const control = new FormControl(futureDate.toISOString().split('T')[0]);
      const validator = CustomValidators.dateGreaterThanOrEqualToday();
      expect(validator(control)).toBeNull();
    });
  });

  describe('dateOneYearAfter', () => {
    it('should return null if the revision date is exactly one year after the release date', () => {
      const releaseDate = new Date();
      const oneYearLater = new Date(releaseDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      const releaseDateControl = new FormControl(releaseDate.toISOString().split('T')[0]);
      const revisionDateControl = new FormControl(oneYearLater.toISOString().split('T')[0]);
      const validator = CustomValidators.dateOneYearAfter(releaseDateControl);

      expect(validator(revisionDateControl)).toBeNull();
    });

    it('should return an error object if the revision date is not one year after the release date', () => {
      const releaseDate = new Date();
      const notOneYearLater = new Date(releaseDate);
      notOneYearLater.setDate(releaseDate.getDate() + 30); // No es exactamente un año después

      const releaseDateControl = new FormControl(releaseDate.toISOString().split('T')[0]);
      const revisionDateControl = new FormControl(notOneYearLater.toISOString().split('T')[0]);
      const validator = CustomValidators.dateOneYearAfter(releaseDateControl);

      expect(validator(revisionDateControl)).toEqual({ dateOneYearAfter: true });
    });
  });
});
