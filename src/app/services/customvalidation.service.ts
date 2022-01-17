import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { UserRestService } from '../models/user-rest.service';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  constructor(private userService: UserRestService) { }

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  OneFieldAtLess(field1: string, field2: string) {
    return (formGroup: FormGroup) => {
      const field1Control = formGroup.controls[field1];
      const field2Control = formGroup.controls[field2];

      /*if (!passwordControl || !confirmPasswordControl) {
        return null;
      }*/
      if (!field1Control || !field2Control) {
        console.log('entro 1')
        return null;
      }
      if (field1Control.errors && !field1Control.errors.OneFieldAtLess) {
        console.log('entro 2')
        return null;
      }
      if (field2Control.errors && !field2Control.errors.OneFieldAtLess) {
        console.log('entro 3')
        return null;
      }
      //console.log('valores',field1Control.value, field2Control.value)
      if ( (field1Control.value == "" ||  field1Control.value == null ) && 
            (field2Control.value == "" || field2Control.value == null) ) {
       console.log('entro 4')
        field1Control.setErrors({ OneFieldAtLess: true });
        field2Control.setErrors({ OneFieldAtLess: true });
      } else {
        field1Control.setErrors(null);
        field2Control.setErrors(null);
      }
    }
  }

  userNameValidator(userControl: AbstractControl,idExcluye:string) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.validateUserName(userControl.value,idExcluye)
          .then((v) => {
            console.log('resultado', v)
            if (v) {
              resolve({ userNameNotAvailable: true });
            } else {
              resolve(null);
            }
          })
      }, 1000);
    });
  }

  validateUserName(userName: string,idExcluye:string) {
    return new Promise(resolve => {
      if (userName != undefined) {
        console.log('user name', userName)
        this.userService.getUserbyName(userName).subscribe(result => {
          console.log('busqueda x user', result, idExcluye)
          if (result != null && result.userId!=idExcluye) {
            resolve(true);
          } else {
            resolve(null);
          }
        });
      }
    })
  }
}