import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./component/login/login.component";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () => import("./frontend/frontend.module")
      .then(m => m.FrontendModule)
  },
  {
    path: "admin",
    loadChildren: () => import("./admin/admin.module")
      .then(m => m.AdminModule)
  },
  {
    path: "login",component:LoginComponent
  },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/home", pathMatch: "full" },
]


export const routing = RouterModule.forRoot(routes);