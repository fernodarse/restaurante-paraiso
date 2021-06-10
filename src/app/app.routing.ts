import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./admin/login/login.component";
import { AdminAuthGuard } from "./guards/admin-auth.guard";
import { Role } from 'src/app/models/staticts';

const routes: Routes = [
  {
    path: "inicio",
    loadChildren: () => import("./frontend/frontend.module")
      .then(m => m.FrontendModule)
  },
  {
    path: "admin",
    loadChildren: () => import("./admin/admin.module")
      .then(m => m.AdminModule),
    canActivate: [AdminAuthGuard], 
    data: { 
      expectedRole: Role.Admin
    } 
  },
  { path: "login", component: LoginComponent, pathMatch: "full" },
  { path: "", redirectTo: "/inicio", pathMatch: "full" },
]


export const routing = RouterModule.forRoot(routes);