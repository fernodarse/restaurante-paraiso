import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserRestService } from 'src/app/models/user-rest.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  message: string;

  constructor(public userService: UserRestService, public router: Router) {
    this.message = '';
  }

  login(username: string, password: string) {
    this.message = '';
    this.userService.makeLogin(username, password)
    .pipe(catchError((error: Response) =>{ 
      this.message = 'Usuario y contraseña incorrectos.';
      setTimeout(function() {
        this.message = '';
      }.bind(this), 9500);
      return of(false);
    }))
   .subscribe(data => {
      console.log('datos recibidos login ',data);
      const { access_token } = data as any;
      console.log('token ',access_token);
      if(access_token!=undefined){
        localStorage.setItem('token',access_token)
        this.router.navigateByUrl('/admin');
      }
    });
  }

  logout(): boolean {
   // this.authService.logoutBackend();
    return false;
  }

}
