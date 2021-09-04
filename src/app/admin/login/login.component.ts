import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppUser } from 'src/app/models/appuser';
import { UserRestService } from 'src/app/models/user-rest.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  message: string;

  user: AppUser = new AppUser();

  submit: boolean = false;

  constructor(@Inject("autenticar")private authService: AuthService, public router: Router) {
    this.message = '';
  }

  async onSubmit(form: NgForm): Promise<void> {
    this.message = '';
    if (form.valid) {
      this.submit = true;
      this.authService.loginUser(this.user.userName, this.user.password)
        .subscribe((result) => {
          //"auth/invalid-email"
          this.submit = false;
          console.log('result', result);
          if(result==true){
            console.log('entro');
            this.router.navigateByUrl('/admin');
          }
          if ((result as any).code) {
            this.message = (result as any).message
          }
          console.log('resp autenti result', result);
          setTimeout(function () {
            this.message = '';
          }.bind(this), 9500);
        }) 
    }
  }

  getValidationMessages(state: any, thingName?: string) {
    let thing: string = state.path || thingName;//tiene el mombre del campo
    let messages: string[] = [];
    if (state.errors) {
      for (let errorName in state.errors) {
        switch (errorName) {
          case "required":
            messages.push(`Se <strong> requiere </strong> el campo ${thing}`);
            break;
          case "email":
            messages.push(`El ${thing} no es válido`);
            break;
        }
      }
    }
    //console.log('errores ',messages)
    return messages;
  }


}
