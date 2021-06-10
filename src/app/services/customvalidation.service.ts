import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { UserRestService } from 'src/app/models/user-rest.service';

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
          console.log('busqueda x user', result)
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