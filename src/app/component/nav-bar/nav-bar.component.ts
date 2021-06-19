import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/app/models/appuser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  appUser: AppUser;
  url:string;
  constructor(@Inject("autenticar")private authService: AuthService,
    private router: Router,
    /*private authService: AuthAdminRestService*/) {

    //actualizando la ruta de navegacion
    console.log('URL ',router.url);
    this.url=router.url;
    router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(event => 
      {
         this.url = (event as NavigationEnd).url;          
         console.log(event);
      });   
    
   }  

  ngOnInit(): void {
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
  }

  login() {
    this.authService.login();
  }
  
  logout() {
    this.authService.logout();
  }

  isAdmin(){
    return this.url.split('/').indexOf('admin')>-1
  }

  getUserAdmin(){
    // return this.appUser//this.authService.decode()
    console.log('data', this.authService.getUserData())
    return this.authService.getUserData()
  }

  logoutAdmin(){
    //localStorage.removeItem('token');
    this.authService.logout()
   // this.router.navigate(['/']);
  }

}
