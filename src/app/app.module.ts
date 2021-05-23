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
 
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,    
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    NgMaterialModule, 
    routing,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
