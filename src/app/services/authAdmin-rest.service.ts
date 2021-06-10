import { Injectable, OnInit } from '@angular/core';
import { AppUser } from '../models/appuser';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Role } from '../models/staticts';
import { UserRestService } from '../models/user-rest.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminRestService implements OnInit{

  appUser$: any/*Observable<any>*/;
  public jwtHelper: JwtHelperService

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserRestService,
    ) {
      this.jwtHelper= new JwtHelperService();
     /* const token: string = localStorage.getItem('token');
      if(token){
        console.log('buscando user para token',token)
        //this.appUser$=
        this.userService.profile()
        .pipe(catchError((error: Response) =>{ 
          console.log('no autorizado',error)
          return null//of(null);
        }))
        .subscribe((userData) => {
          this.appUser$=userData;
          console.log('encontrado user para token',this.appUser$)
        }) 
        
      } */ 
  }
  ngOnInit(): void {
    
    
  }

  async login(username:string,password:string) {
    return this.userService.makeLogin(username,password);
  }

 
  async logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }  

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    console.log('isAuthenticated token', token);
    console.log('decodificando', this.jwtHelper.decodeToken(token))
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  public decode(){
    const token = localStorage.getItem('token');
    return this.jwtHelper.decodeToken(token)
  }
  public isAdmin(){
    return this.decode().rol==Role.Admin;
  }

}
