import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FrontendComponent } from './frontend.component';
import { MenuComponent } from './menu/menu.component';
import { ContactComponent } from './contact/contact.component';

import { NgMaterialModule } from '../ng-material/ng-material.module';
import { ListCategoriaMenu } from '../models/staticts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { GalleryComponent } from './gallery/gallery.component';
import { BookingComponent } from './booking/booking.component';
import { AboutComponent } from './about/about.component';
import { MainSliderComponent } from './main-slider/main-slider.component';
import { SpecialComponent } from './special/special.component';
import { BookingService } from '../models/booking.service';
import { BookingRestService } from '../models/booking-rest.service';
import { DocPipe } from '../pipe/doc.pipe';
import { TruncateTextPipe } from '../pipe/truncatetext.pipe';
import { DatePipe } from '@angular/common';


let routes= RouterModule.forChild([
  { path: "", component: FrontendComponent, pathMatch: "full" },
  { path: '**', component: FrontendComponent }
]);

@NgModule({  
  imports: [
    CommonModule,routes, NgMaterialModule,FormsModule,HttpClientModule,ComponentModule,ReactiveFormsModule
  ],
  declarations: [FrontendComponent, 
    MenuComponent, GalleryComponent, BookingComponent, ContactComponent, AboutComponent, MainSliderComponent,SpecialComponent,
    
  ],
  providers: [    
    ListCategoriaMenu,
    AuthService,
    DatePipe,

    MenuService, 
    UserService,   
    CommentService,
    BookingService,   

   /* { provide: MenuService, useClass: MenuRestService }, 
    { provide: UserService, useClass: UserRestService },
    { provide: CommentService, useClass: CommentRestService },
    { provide: BookingService, useClass: BookingRestService },*/
  ]
})
export class FrontendModule { }
