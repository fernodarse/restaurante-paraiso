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
import { MenuService } from '../models/menu.service';
import { MenuRestService } from '../models/menu-rest.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FileService } from '../models/file.service';
import { FileRestService } from '../models/file-rest.service';
import { EventoService } from '../models/evento.service';
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
import { AuthAdminRestService } from '../services/authAdmin-rest.service';

const childRoutes: Routes = [
  /*{ path: "", component: IntroComponent, pathMatch: "full" },
  { path: "sku", component: DemoFormSkuComponent, pathMatch: "full" },*/
  { path: "", component: MenuComponent, pathMatch: "full" },
  { path: "evento", component: EventoComponent, pathMatch: "full" },
  { path: "comentario", component: CommentsComponent, pathMatch: "full" },
  { path: "usuario", component: UserComponent, pathMatch: "full" },
];

let routes = RouterModule.forChild([
  { path: "", component: AdminComponent, children: childRoutes },  
  /*{ path: "sku", component: DemoFormSkuComponent/*, children: childRoutes },*/
]);

@NgModule({
  declarations: [
    MenuComponent, TableMenuComponent, FormMenuComponent,
    EventoComponent, TableEventoComponent, FormEventoComponent, CommentsComponent, TableComponent,
    DocPipe, TruncateTextPipe,
    CardComponent,
    UserComponent,
    TableUserComponent,
    FormUserComponent,
    PasswordPatternDirective,
    MatchPasswordDirective,
    ValidateUserNameDirective,
    AdminComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, routes, NgMaterialModule, HttpClientModule,ComponentModule
  ],
  providers: [
    { provide: SHARED_STATE, useValue: new Subject<SharedState>() },
    ListCategoriaMenu,
    DatePipe,
    MenuService,//{ provide: MenuService, useClass: MenuRestService },
    FileService,//{ provide: FileService, useClass: FileRestService }, 
      /*EventoService, */{ provide: EventoService, useClass: EventoRestService },
    UserRestService,
    CustomvalidationService,
    /*AuthService,*///{ provide: AuthService, useClass: AuthRestService },
    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
})
export class AdminModule { }
