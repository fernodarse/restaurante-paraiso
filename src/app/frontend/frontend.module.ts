import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FrontendComponent } from './frontend.component';
import { MenuComponent } from './menu/menu.component';
import { BannerComponent } from './banner/banner.component';
import { GaleriaComponent } from './galeria/galeria.component';
import { ReservaComponent } from './reserva/reserva.component';
import { ContactComponent } from './contact/contact.component';
import { ScrollerComponent } from './scroller/scroller.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { ListCategoriaMenu } from '../models/staticts';
import { CommentsComponent } from './menu/comments/comments.component';
import { FormsModule } from '@angular/forms';


let routes= RouterModule.forChild([
  { path: "", component: FrontendComponent, pathMatch: "full" },
  { path: '**', component: FrontendComponent }
]);

@NgModule({  
  imports: [
    CommonModule,routes, NgMaterialModule,FormsModule,
  ],
  declarations: [FrontendComponent, MenuComponent, BannerComponent, 
    GaleriaComponent, ReservaComponent, ContactComponent, ScrollerComponent, CommentsComponent,
  ],
  providers: [ListCategoriaMenu,]
})
export class FrontendModule { }
