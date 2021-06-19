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
import { MenuService } from '../models/menu.service';
import { MenuRestService } from '../models/menu-rest.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { AuthRestService } from '../services/auth-rest.service';
import { UserRestService } from '../models/user-rest.service';
import { NavBarComponent } from '../component/nav-bar/nav-bar.component';
import { ComponentModule } from '../component/component.module';
import { UserService } from '../models/user.service';
import { CommentService } from '../models/comment.service';
import { CommentRestService } from '../models/comment-rest.service';


let routes= RouterModule.forChild([
  { path: "", component: FrontendComponent, pathMatch: "full" },
  { path: '**', component: FrontendComponent }
]);

@NgModule({  
  imports: [
    CommonModule,routes, NgMaterialModule,FormsModule,HttpClientModule,ComponentModule,
  ],
  declarations: [FrontendComponent, MenuComponent, BannerComponent, 
    GaleriaComponent, ReservaComponent, ContactComponent, ScrollerComponent, CommentsComponent,
    
  ],
  providers: [
    ListCategoriaMenu,
    AuthService,

    MenuService, 
    UserService,   
    CommentService,      

    /*{ provide: MenuService, useClass: MenuRestService },
    { provide: UserService, useClass: UserRestService },
    { provide: CommentService, useClass: CommentRestService },*/
  ]
})
export class FrontendModule { }
