import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AuthRestService } from '../services/auth-rest.service';

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.css']
})
export class FrontendComponent implements OnInit {

  constructor(
    private authService: AuthRestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.appUser$.subscribe(user => {
      if (!user) {
        return;
      } else {
        const returnUrl = localStorage.getItem('returnUrl');
        if (!returnUrl) {
          return;
        }
        localStorage.removeItem('returnUrl');
        this.router.navigateByUrl(returnUrl);
      }
    });
  }

}
