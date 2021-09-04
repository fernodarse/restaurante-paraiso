import { Injectable } from '@angular/core';
import { AppUser } from '../models/appuser';
import { Observable, of, throwError } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Role } from '../models/staticts';
import { UserRestService } from '../models/user-rest.service';
import { UserService } from '../models/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthRestService {

  appUser$: Observable<AppUser>;
  public jwtHelper: JwtHelperService

  constructor(public afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    /*private userService: UserRestService*/
    private userService: UserService) {

    this.appUser$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          console.log('uid inicio', user.uid)
          return this.userService.getUserbyRedId(user.uid)
        } else {
          return of(null);
        }
      })
    );
    this.jwtHelper= new JwtHelperService();
  }
  private updateUserData(user) {
      console.log('creado')
      return this.userService.createRed(user)
  }

  public getUserData(){
    return this.decode();
  }

  /**
   * autenticarse en las redes sociales
   * @returns Entidad Usuario del sistema con los datos del user de la red
   */
  async login() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || this.router.url;
    localStorage.setItem('returnUrl', returnUrl);
    const credential = await this.afAuth.signInWithPopup(
      new firebase.default.auth.GoogleAuthProvider()
      );
    let userCreado= this.updateUserData(credential.user);
    console.log(userCreado);
    return userCreado;
  }

  /**
   * Cierra session a los usuarios de la red
   */
  async logout() {
    localStorage.removeItem('token');
    await this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  loginUser(username:string,password:string):Observable<any> {
    console.log('login  rest serv')    
    return new Observable((observer) => {
      this.userService.makeLogin(username,password)
      .pipe(catchError((error: Response) => {
        let newError={code: "", message:""}
        console.log('error',error)
        let resp= error.toString().split(':')
        console.log(resp)
        if(resp[0].indexOf("Access Denied")>-1){
          newError= {
            code: "auth/wrong-password",
            message:'Usuario y contraseña incorrectos.'
          }
        }
        if(resp[0].indexOf("No Response")>-1){
          newError= {
            code: "no-response",
            message:'No se ha establecido conexión con el servidor.'
          }
        }

        // Network Error: Unauthorized (401) No Response
        return of(newError);
      }
      ))
      .subscribe(data => {
        console.log('datos recibidos login ', data);
        const { access_token } = data as any;
        console.log('token ', access_token);
        if (access_token != undefined) {
          localStorage.setItem('token', access_token)
          return observer.next(true)
          //this.router.navigateByUrl('/admin');
        }else{
          return observer.next(
            {
              code: data.code,
              message: data.message
            })
        }
      })
    })//.toPromise()
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    console.log('isAuthenticated token', token);
    console.log('decodificando', this.jwtHelper.decodeToken(token))
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  private decode(){
    const token = localStorage.getItem('token');
    return this.jwtHelper.decodeToken(token)
  }
  public isRol(rol:string){
    return this.decode().rol==rol;
  } 

}
