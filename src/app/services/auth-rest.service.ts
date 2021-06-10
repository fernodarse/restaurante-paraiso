import { Injectable } from '@angular/core';
import { AppUser } from '../models/appuser';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Role } from '../models/staticts';
import { UserRestService } from '../models/user-rest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRestService {

  appUser$: Observable<AppUser>;

  constructor(public afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserRestService) {

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
  }
  private updateUserData(user) {
      console.log('creado')
      return this.userService.createRed(user)
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
    await this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

 /* async loginBackend(username:string,password:string): Observable<any>{
     return this.userService.makeLogin(username,password);
  }

  async logoutBackend() {
  }*/

  

}
