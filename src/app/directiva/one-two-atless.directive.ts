import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, FormGroup } from '@angular/forms';
import { CustomvalidationService } from '../services/customvalidation.service';

@Directive({
  selector: '[filds]',
  providers: [{ provide: NG_VALIDATORS, useExisting: OneTwoAtlessDirective, multi: true }]
})
export class OneTwoAtlessDirective {

  @Input('filds') filds: string[] = [];

  constructor(private customValidator: CustomvalidationService) { }

  validate(formGroup: FormGroup): ValidationErrors {
    console.log('validando')
    return this.customValidator.OneFieldAtLess(this.filds[0], this.filds[1])(formGroup);
    //return this.customValidator.MatchPassword(this.filds[0], this.filds[1])(formGroup);
  }

}
