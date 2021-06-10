import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthAdminRestService } from '../services/authAdmin-rest.service';
import { map } from 'rxjs/operators';
import { AppUser } from '../models/appuser';
import { Router } from '@angular/router';
import { UserRestService } from '../models/user-rest.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    /*private userService: UserRestService*/
    private autAdmin: AuthAdminRestService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const expectedRole = route.data.expectedRole;
      const tokenPayload = this.autAdmin.decode()
      if (!this.autAdmin.isAuthenticated() || tokenPayload.rol!=expectedRole) {
        console.log('usario sin logear');
        //this.router.navigateByUrl('/admin/login');
        this.router.navigate(['/login']);
        return false;
      }
      return true;
  }

}
