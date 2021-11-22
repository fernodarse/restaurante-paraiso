import { Injectable } from '@angular/core';
import { AppUser } from '../models/appuser';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../models/staticts';
import { UserRestService } from '../models/user-rest.service';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class AuthService {

  appUser$: Observable<AppUser>;
  userData: AppUser;
  findUser: AppUser;
  public loggedIn: boolean;

  constructor( private route: ActivatedRoute,
    private router: Router,
    private userService: UserRestService) {

    this.appUser$.subscribe((data)=>{
      console.log('datos de usuario', data)
      this.userData=data;      
    })
  }
  public getUserData(){
    return this.userData;
  }
  private updateUserData(user,rol) {
    console.log('creado')
      return this.userService.createRed(user,rol)
  }

  public signInWithGoogle(): Observable<AppUser> {
    return of(null)
  }

  public signInWithFB(): void {}
  
  async login() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || this.router.url;
    localStorage.setItem('returnUrl', returnUrl);
    const credential=null
    return this.updateUserData(credential.user,Role.User);
  }

  async logout() {
  }

  
  loginUser(email, password):Observable<any> {
    console.log('login  serv')
    let newError={code: "", message:""}
    return new Observable((observer) => {
      this.userService.makeLogin(email, password)
      .subscribe((result)=> {
        console.log(result)
        if(result.userName != undefined){
          this.userData=result;
          return  observer.next(true)
        }else{
          return observer.next(
            {
              code: "auth/wrong-password",
              message: 'Usuario y contraseña incorrectos.'
            })
        }
      });
    })
  }

  public isAuthenticated(): boolean {
    console.log('isAuthenticated ',this.userData)
    return this.userData!=null
  }

  public isRol(rol:string){
    console.log('isRol ',this.userData.rol)
    return this.userData.rol==rol;
  } 
}
