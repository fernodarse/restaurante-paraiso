import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { TableMenuComponent } from './menu/table/table-menu.component';
import { FormMenuComponent } from './menu/form/form-menu.component';
import { SharedState, SHARED_STATE } from '../models/sharedState.model';
import { Subject } from 'rxjs';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { ListCategoriaMenu } from '../models/staticts';
import { EventoComponent } from './evento/evento.component';
import { TableEventoComponent } from './evento/table/table.component';
import { FormEventoComponent } from './evento/form/form.component';
import { CommentsComponent } from './comments/comments.component';
import { TableComponent } from './comments/table/table.component';

import { DocPipe } from '../pipe/doc.pipe';
import { TruncateTextPipe } from '../pipe/truncatetext.pipe';
import { CardComponent } from './comments/card/card.component';

const childRoutes: Routes = [
  /*{ path: "", component: IntroComponent, pathMatch: "full" },
  { path: "sku", component: DemoFormSkuComponent, pathMatch: "full" },*/
  ];
  
let routes= RouterModule.forChild([
    { path: "", component: MenuComponent, pathMatch: "full" },
    { path: "evento", component: EventoComponent, pathMatch: "full" },
    { path: "comentario", component: CommentsComponent, pathMatch: "full" },
    /*{ path: "sku", component: DemoFormSkuComponent/*, children: childRoutes },*/
  ]);

@NgModule({
  declarations: [
    MenuComponent, TableMenuComponent, FormMenuComponent,
    EventoComponent, TableEventoComponent, FormEventoComponent, CommentsComponent, TableComponent,
    DocPipe,TruncateTextPipe,
    CardComponent,
  ],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule, routes, NgMaterialModule,
  ],
  providers: [
    { provide: SHARED_STATE, useValue: new Subject<SharedState>() },
      ListCategoriaMenu,
      DatePipe
    ],  
})
export class AdminModule { }
