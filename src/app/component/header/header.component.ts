import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppUser } from 'src/app/models/appuser';
import { AuthRestService } from 'src/app/services/auth-rest.service';
import { AuthService } from 'src/app/services/auth.service';
declare var $: any

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit {
 
  appUser: AppUser;

  @ViewChild('loginfirebase') 
   private testElement: ElementRef;

   unlistener: any;  

  constructor(@Inject("autenticar")private authService: AuthRestService,
              private router: Router,
              private renderer: Renderer2,
             ) {
  }

  ngAfterViewInit() {
    /*this.unlistener = this.renderer.listen(this.testElement.nativeElement, 'click', (event) => {
      //this.renderer.setStyle(this.testElement.nativeElement, 'color', 'green');
      event.preventDefault();
      this.login()
  });*/
  //   $(document).on('ready', function () {
      // initialization of popups
      $.HSCore.components.HSModalWindow.init('[data-modal-target]');
  //  });
  }
  ngOnInit(): void {
    // initialization of header
    $.HSCore.components.HSHeader.init($('#js-header'));
    $.HSCore.helpers.HSHamburgers.init('.hamburger');


    // initialization of go to section
    $.HSCore.components.HSGoTo.init('.js-go-to');

    $(window).on('load', function () {
      console.log("load from header")
      // initialization of HSScrollNav
      $.HSCore.components.HSScrollNav.init($('#js-scroll-nav'), {
        duration: 700
      });
    });

    $(window).on('resize', function () {
      setTimeout(function () {
        $.HSCore.components.HSTabs.init('[role="tablist"]');
      }, 200);
    }); 

    this.authService.appUser$.subscribe(appUser => {
      console.log('recibiendo user')
      this.appUser = appUser
    });    
  }
  
  logout() {
    this.authService.logout();
  }

  /*ngOnDestroy() {
    this.unlistener();
  }*/

  signInWithGoogle(): void {
    this.authService.signInWithGoogle()
  }

  signInWithFB(): void {
    this.authService.signInWithFB()
  }

  isLoging(){
    return this.appUser != null
  }

  /*signOut(): void {
    this.socialAuthService.signOut();
  }

  refreshToken(): void {
    this.socialAuthService.refreshAuthToken(FacebookLoginProvider.PROVIDER_ID);
  }*/

}
