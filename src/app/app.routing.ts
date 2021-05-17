import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";

const routes: Routes = [
  {
    path: "inicio",
    loadChildren: () => import("./frontend/frontend.module")
      .then(m => m.FrontendModule)
  },
  {
    path: "admin",
    loadChildren: () => import("./admin/admin.module")
      .then(m => m.AdminModule)
  },
  { path: "", redirectTo: "/inicio", pathMatch: "full" },
]


export const routing = RouterModule.forRoot(routes);