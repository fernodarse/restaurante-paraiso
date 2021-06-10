import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/app/models/appuser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthAdminRestService } from 'src/app/services/authAdmin-rest.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  appUser: AppUser;
  url:string;
  constructor(private authService: AuthService,
    private router: Router,
    private authAdminService: AuthAdminRestService) {

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
     return this.authAdminService.decode()
  }

  logoutAdmin(){
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

}
