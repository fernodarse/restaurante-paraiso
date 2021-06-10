import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { FormsModule } from '@angular/forms';
import { routing } from '../app.routing';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [NavBarComponent],
  imports: [
    CommonModule,NgMaterialModule ,FormsModule,RouterModule
  ],
  exports: [NavBarComponent]
})
export class ComponentModule { }
