import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { FormsModule } from '@angular/forms';
import { routing } from '../app.routing';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TableOpcionComponent } from './table-opcion/table-opcion.component';
import { DirectivaModule } from '../directiva/directiva.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';



@NgModule({
  declarations: [NavBarComponent,HeaderComponent, TableOpcionComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,NgMaterialModule ,FormsModule,RouterModule,DirectivaModule
  ],
  exports: [NavBarComponent,HeaderComponent, TableOpcionComponent, ConfirmDialogComponent]
})
export class ComponentModule { }
