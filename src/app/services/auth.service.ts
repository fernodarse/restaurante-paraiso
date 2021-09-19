import { Injectable } from '@angular/core';
import { AppUser } from '../models/appuser';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { catchError, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Role } from '../models/staticts';
import { UserService } from '../models/user.service';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class AuthService {

  appUser$: Observable<AppUser>;
  userData: AppUser;
  findUser: AppUser;
  public loggedIn: boolean;

  constructor(/*public afAuth: AngularFireAuth,*/
    private route: ActivatedRoute,
    private router: Router,
    /*private db: AngularFirestore*/
    private userService: UserService) {

    /*this.appUser$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          //return this.db.doc<AppUser>(`appusers/${user.uid}`).valueChanges();
          let findUser=  this.userService.getUserbyId(user.uid)
          console.log('usuario para merge', findUser)
          return findUser;
        } else {
          return of(null);
        }
      })
    );*/
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
    const credential=null/* = await this.afAuth.signInWithPopup(
      new firebase.default.auth.GoogleAuthProvider()
      //this.afAuth.
      );*/
    return this.updateUserData(credential.user,Role.User);
  }

  async logout() {
    /*await this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });*/
  }

   // Sign in with email/password
  /*loginUser(email, password):Observable<any> {
    console.log('login  serv')
    return new Observable((observer) => {
      this.afAuth.signInWithEmailAndPassword(email, password).then(credential => {        
        console.log('credential ', credential)
        if (credential != undefined) {
          let userRed=credential.user
          //this.updateUserData(userRed,Role.Admin)      
          return observer.next(true)
        }else{
          return observer.next(false)
        }
      })
      .catch((error) => {
        let newError={code: "", message:""}
        console.log('error autenti', error)
        if (error.code == "auth/network-request-failed") {
          newError= {
            code: error.code,
            message:'Hay problemas de conección'
          }
        }
        if (error.code == "auth/wrong-password" || error.code ==  "auth/user-not-found") {
          newError= {
            code: error.code,
            message:'Usuario y contraseña incorrectos.'
          }
        }
        if (error.code == "auth/invalid-email") {
          newError= {
            code: error.code,
            message:'Correo incorrecto.'
          }
        }
        //return of(newError);
        return observer.next(newError)
      })
    })//.toPromise()
  }*/
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
