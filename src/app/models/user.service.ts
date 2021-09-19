import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AppUser } from './appuser';
import { Role } from './staticts';
import * as admin from "firebase-admin";
import { serviceAccount } from '../../.././ServiceAccount';
import { EncryptionService } from '../services/encryption.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private list: AppUser[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private db: AngularFirestore, private ecript: EncryptionService) {
    const users = this.db.collection<AppUser>('appusers')
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(
            c => ({
              userId: c.payload.doc.id,
              ...c.payload.doc.data()
            }));
        })).subscribe(result => {
          this.list = result;
          console.log("getAllUser services", this.list)
        });
 }

  create(user: AppUser) {
    user.password=this.ecript.hash(user.password)
    const objData = JSON.parse(JSON.stringify(user));
    console.log("createUser ", objData);
    return this.db.collection('appusers').add(objData);
  }

  createRed(user: any, rol = Role.User):Observable<AppUser> {
    const userRef = this.db.doc(`appusers/${user.id}`);
    const data = {
      name: user.name ? user.name : user.email,
      email: user.email,
      photoURL: user.photoURL,
      rol: rol,
      username: user.email,
    };
    //return userRef.set(data, { merge: true });
    return of(null)
  }

  getAllUser(): AppUser[] {
    return this.list;
  }

  getUserbyId(id: string): Observable<AppUser> {

    let obj = this.db.collection<AppUser>('appusers').doc(id)
      .snapshotChanges()
      .pipe(
        map(actions => {
          console.log('snapshotChanges', actions)
          let find = ({
            userId: actions.payload.id,
            ...actions.payload.data()
          })
          let userData = new AppUser();
          Object.assign(userData, find)
          console.log('objeto asigando', userData)
          return userData
        }))
      //.toPromise()
      ;
    return obj;
  }

  getUserbyRedId(id: string): Observable<AppUser> {
    return this.getUserbyId(id);
  }

  getUserbyName(userName: string): Observable<AppUser> {
    const usuarioFind = this.db.collection<AppUser>('appusers',
      ref => ref.where('userName', '==', userName))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(
            c => ({
              userId: c.payload.doc.id,
              ...c.payload.doc.data()
            }));
        }))
      //.valueChanges()
      .pipe(
        map(value => value.length > 0 ? value[0] : null),
      );
    return usuarioFind;
  }


  deleteUser(objId: string) {
    return this.db.doc('appusers/' + objId).delete();
  }

  updateUser(Id: string, user: AppUser,cambiarPas=false) {

    /*console.log('modificar usuario ',user)
    const putData = JSON.parse(JSON.stringify(user));
    return this.db.doc('appusers/' + Id).update(putData);*/
    if(cambiarPas){
      user.password=this.ecript.hash(user.password)
    }
    console.log('modificar usuario ',user)
    const putData = JSON.parse(JSON.stringify(user));
    return this.db.doc('appusers/' + Id).update(putData);
  }

  makeLogin(username: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.getUserbyName(username)
      .subscribe((user) => {
        if (user && this.ecript.compare(password, user.password)) {
          return observer.next(user)
        }
        return observer.next(false)
      })
    })     
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
