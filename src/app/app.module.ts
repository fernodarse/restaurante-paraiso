import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
//fireBase config
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgMaterialModule } from './ng-material/ng-material.module'

import { routing } from './app.routing';
//import { NavBarComponent } from './component/nav-bar/nav-bar.component';
//import { HeaderComponent } from './component/header/header.component'
 
@NgModule({
  declarations: [
    AppComponent,
    //LoginComponent,
    //NavBarComponent,
    //HeaderComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    NgMaterialModule, 
    routing
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
