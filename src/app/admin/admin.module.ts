import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { TableMenuComponent } from './menu/table/table-menu.component';
import { FormMenuComponent } from './menu/form/form-menu.component';
import { SharedState, SHARED_STATE } from '../models/sharedState.model';
import { Subject } from 'rxjs';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { ListCategoriaMenu } from '../models/staticts';

const childRoutes: Routes = [
  /*{ path: "", component: IntroComponent, pathMatch: "full" },
  { path: "sku", component: DemoFormSkuComponent, pathMatch: "full" },*/
  ];
  
let routes= RouterModule.forChild([
    { path: "", component: MenuComponent, pathMatch: "full" },
    //{ path: "", component: IntroComponent/*, children: childRoutes*/ },
    /*{ path: "sku", component: DemoFormSkuComponent, pathMatch: "full" },*/
  ]);

@NgModule({
  declarations: [MenuComponent, TableMenuComponent, FormMenuComponent],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule, routes, NgMaterialModule,
  ],
  providers: [
    { provide: SHARED_STATE, useValue: new Subject<SharedState>() },
      ListCategoriaMenu
    ]
  
})
export class AdminModule { }
