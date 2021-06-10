import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { TableMenuComponent } from './menu/table/table-menu.component';
import { FormMenuComponent } from './menu/form/form-menu.component';
import { SharedState, SHARED_STATE } from '../models/sharedState.model';
import { Subject } from 'rxjs';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { ListCategoriaMenu } from '../models/staticts';
import { NavBarComponent } from '../component/nav-bar/nav-bar.component';
import { LoginComponent } from '../component/login/login.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

let routes = RouterModule.forChild([
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
    ]
  },
  { path: '**', redirectTo: 'dashboard' },

]);

@NgModule({
  declarations: [LoginComponent, MenuComponent, TableMenuComponent, FormMenuComponent, NavBarComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, routes, NgMaterialModule
  ],
  providers: [
    { provide: SHARED_STATE, useValue: new Subject<SharedState>() },
    ListCategoriaMenu
  ]

})
export class AdminModule { }
