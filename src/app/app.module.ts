import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
//fireBase config
import { environment } from 'src/environments/environment';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgMaterialModule } from './ng-material/ng-material.module'


import { routing } from './app.routing';
import { NavBarComponent } from './component/nav-bar/nav-bar.component'
import { REST_URL } from './models/rest.datasource';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { AuthRestService } from './services/auth-rest.service';
import { UserRestService } from './models/user-rest.service';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
 
@NgModule({
  declarations: [
    AppComponent,    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgMaterialModule, 
    routing,    
    HttpClientModule,
    SocialLoginModule,
  ],
  providers: [             
    { provide: REST_URL, useValue: `https://frozen-fjord-03752.herokuapp.com/` }, //https://frozen-fjord-03752.herokuapp.com/ - http://${location.hostname}:3000/
    AdminAuthGuard,
    UserRestService,


   { provide: 'autenticar', useClass: AuthRestService },
   {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '107470416652-8a3iglgg4v80ccfibbvos0tvips5sdva.apps.googleusercontent.com'
          )
        },
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('1782485098619430')
        }
      ]
    } as SocialAuthServiceConfig,
  }
  ], 
  exports: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
