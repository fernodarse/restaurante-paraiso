import { Inject, Injectable } from '@angular/core';
import { Evento } from './evento';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestDataSource, REST_URL } from './rest.datasource';
import { AppUser } from './appuser';
import { Role } from './staticts';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserRestService extends RestDataSource {

  private list: AppUser[] = [];
  private unsubscribe$ = new Subject<void>();
  private urlAut:string;
  private urlProfile:string;
  
  constructor(http: HttpClient, @Inject(REST_URL) private url: string,public router: Router) {
    super(http,router);
    this.urlAut=url+'auth/login/'
    this.urlProfile=url+'profile/'
    this.url = url + "user/";
    super.sendRequest<AppUser[]>("GET", this.url)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.list = result;
      console.log("getAllUser", this.list)
    });
    
   }  

  create(user: AppUser) {

    let data = super.sendRequest<AppUser>("POST", this.url, user)
    .subscribe(u => {
      
      if((u as any)._id) {
        user.userId=(u as any)._id;
      } 
      console.log('user recibido', u)
      Object.assign(user,u)
      console.log('user salvado', user)  
      this.list.unshift(user)   
    })  

    return of(user).toPromise() ;
  }

  createRed(user: any) {
    let userData=new AppUser();
    userData.userName=user.uid;
    userData.redId=user.uid;
    userData.email=user.email;
    userData.name= user.displayName,
    userData.photoURL=user.photoURL;
    userData.rol=Role.User
    return this.create(userData);
  }

  getAllUser(): AppUser[] {    
    return this.list;
  }

  getUserbyId(id: string): Observable<AppUser> {
    return super.sendRequest<AppUser>("GET", `${this.url}id/${id}`);
  }

  getUserbyRedId(id: string): Observable<AppUser> {
    return super.sendRequest<AppUser>("GET", `${this.url}red/id/${id}`);
  }

  getUserbyName(userName: string): Observable<AppUser> {
    return super.sendRequest<AppUser>("GET", `${this.url}username/${userName}`);
  }

  deleteUser(userId: string) {
    return this.sendRequest<Evento>("DELETE", `${this.url}${userId}`).toPromise().finally(() => {
      let index= this.list.findIndex(item => item.userId == userId);
      this.list.splice(index,1); 
    });
  }

  updateUser(Id: string, user: AppUser,cambiarPas=false) {
    console.log('user a enviado', user);
    let res=this.sendRequest<AppUser>("PATCH", `${this.url}${Id}`, user);
    res.subscribe((e)=>{
      console.log('modificado')
      let index= this.list.findIndex(item => item.userId == Id);
      Object.assign(user,e)
      this.list.splice(index,1,user);
    })
    return  res.toPromise() 
  }

  makeLogin(username:string,password:string): Observable<any> {  
    let credentials = {
      username: username,
      password: password
    }
    return this.sendRequest<any>("POST", this.urlAut, credentials);     
  }

  profile(): Observable<any> {      
    return this.sendRequest<any>("get", this.urlProfile);     
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
