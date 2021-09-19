import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
//fireBase config
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgMaterialModule } from './ng-material/ng-material.module'
import { AngularFireAuthModule } from '@angular/fire/auth';

import { routing } from './app.routing';
import { NavBarComponent } from './component/nav-bar/nav-bar.component'
import { REST_URL } from './models/rest.datasource';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { AuthRestService } from './services/auth-rest.service';
import { UserService } from './models/user.service';
import { UserRestService } from './models/user-rest.service';
import { DocPipe } from './pipe/doc.pipe';
import { TruncateTextPipe } from './pipe/truncatetext.pipe';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
 
@NgModule({
  declarations: [
    AppComponent,
   // NavBarComponent,    
  ],
  imports: [
    BrowserModule,
    /*AngularFireModule.initializeApp(environment.firebaseConfig), 
    AngularFirestoreModule,
    AngularFireAuthModule,*/
    BrowserAnimationsModule,
    NgMaterialModule, 
    routing,    
    HttpClientModule,
    SocialLoginModule,
    /*JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() { 
        return localStorage.getItem('token');
        }
      }}) */
  ],
  providers: [             
    { provide: REST_URL, useValue: `https://frozen-fjord-03752.herokuapp.com/` },//http://${location.hostname}:3000/
    AdminAuthGuard,

   /*{ provide: 'autenticar', useClass: AuthService},    
   UserService,*/ 

   { provide: 'autenticar', useClass: AuthRestService },
   { provide: UserService, useClass: UserRestService },
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
