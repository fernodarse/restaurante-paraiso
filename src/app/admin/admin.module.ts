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
import { ListCategoriaMenu, Role } from '../models/staticts';
import { EventoComponent } from './evento/evento.component';
import { TableEventoComponent } from './evento/table/table.component';
import { FormEventoComponent } from './evento/form/form.component';
import { CommentsComponent } from './comments/comments.component';
import { TableComponent } from './comments/table/table.component';

import { DocPipe } from '../pipe/doc.pipe';
import { TruncateTextPipe } from '../pipe/truncatetext.pipe';
import { CardComponent } from './comments/card/card.component';
import { MenuRestService } from '../models/menu-rest.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FileRestService } from '../models/file-rest.service';
import { EventoRestService } from '../models/evento-rest.service';
import { UserComponent } from './user/user.component';
import { TableUserComponent } from './user/table/table-user.component';
import { FormUserComponent } from './user/form/form-user.component';
import { UserRestService } from '../models/user-rest.service';
import { CustomvalidationService } from '../services/customvalidation.service';
import { MatchPasswordDirective } from '../directiva/match-password.directive';
import { PasswordPatternDirective } from '../directiva/passwordPattern.directive';
import { ValidateUserNameDirective } from '../directiva/validate-user-name.directive';
import { AdminComponent } from './admin.component';
import { ComponentModule } from '../component/component.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from '../services/auth.service';
import { AuthRestService } from '../services/auth-rest.service';
import { AuthInterceptorService } from '../services/auth-interceptor';
import { CommentRestService } from '../models/comment-rest.service';
import { EncryptionService } from '../services/encryption.service';
import { BookingComponent } from './booking/booking.component';
import { BookingRestService } from '../models/booking-rest.service';
import { TableBookingComponent } from './booking/table/table.component';
import { FormBookingComponent } from './booking/form/form-booking.component';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { DirectivaModule } from '../directiva/directiva.module';
import { OcultarNombrePipe } from '../pipe/ocultar-nombre.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TiempoAtrasPipe } from '../pipe/tiempoatras.pipe';

const childRoutes: Routes = [
  /*{ path: "", component: IntroComponent, pathMatch: "full" },
  { path: "sku", component: DemoFormSkuComponent, pathMatch: "full" },*/
  {
    path: "", redirectTo: "booking"/*,
    canActivate: [AdminAuthGuard],
    data: {
      expectedRole: Role.Admin
    }*/
  },
  {
    path: "evento", component: EventoComponent, pathMatch: "full"/*,
    canActivate: [AdminAuthGuard],
    data: {
      expectedRole: Role.Admin
    }*/
  },
  {
    path: "comentario", component: CommentsComponent, pathMatch: "full"/*,
    canActivate: [AdminAuthGuard],
    data: {
      expectedRole: Role.Admin
    }*/
  },
  {
    path: "usuario", component: UserComponent, pathMatch: "full"/*,
    canActivate: [AdminAuthGuard],
    data: {
      expectedRole: Role.Admin
    }*/
  },
  {
    path: "booking", component: BookingComponent, pathMatch: "full"/*,
    canActivate: [AdminAuthGuard],
    data: {
      expectedRole: Role.Admin
    }*/
  },
  {
    path: "menu", component: MenuComponent, pathMatch: "full"/*,
    canActivate: [AdminAuthGuard],
    data: {
      expectedRole: Role.Admin
    }*/
  },
];

let routes = RouterModule.forChild([
  { path: "", component: AdminComponent, children: childRoutes },
  /*{ path: "sku", component: DemoFormSkuComponent/*, children: childRoutes },*/
]);

@NgModule({
  declarations: [
    MenuComponent, TableMenuComponent, FormMenuComponent,
    EventoComponent, TableEventoComponent, FormEventoComponent, CommentsComponent, TableComponent,
    DocPipe, TruncateTextPipe, OcultarNombrePipe, TiempoAtrasPipe,
    CardComponent,
    UserComponent, TableUserComponent, FormUserComponent,
    PasswordPatternDirective,
    MatchPasswordDirective,
    ValidateUserNameDirective,
    AdminComponent,
    LoginComponent,
    BookingComponent, TableBookingComponent, FormBookingComponent,    
    
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, routes, NgMaterialModule, ScrollingModule, HttpClientModule, ComponentModule, DirectivaModule
  ],
  providers: [
    { provide: SHARED_STATE, useValue: new Subject<SharedState>() },
    ListCategoriaMenu,
    DatePipe,
    AuthService,

    CustomvalidationService,
    EncryptionService,

    MenuRestService,
    EventoRestService,
    EventoRestService,
    CommentRestService,
    BookingRestService,
    FileRestService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
  ],
  exports: []
})
export class AdminModule { }
