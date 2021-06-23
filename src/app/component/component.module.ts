import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { FormsModule } from '@angular/forms';
import { routing } from '../app.routing';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [NavBarComponent,HeaderComponent],
  imports: [
    CommonModule,NgMaterialModule ,FormsModule,RouterModule
  ],
  exports: [NavBarComponent,HeaderComponent]
})
export class ComponentModule { }
