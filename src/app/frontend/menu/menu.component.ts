import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Menu } from 'src/app/models/menu';
import { MenuService } from 'src/app/models/menu.service';
import { CategoriaMenu, ListCategoriaMenu } from 'src/app/models/staticts';

import { AppUser } from 'src/app/models/appuser';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  private menuList: Menu[] = [];
  private unsubscribe$ = new Subject<void>();

  appUser: AppUser;

  selectedMenu:string;

  constructor(private menuServices: MenuService,
    private listCategoriaMenu: ListCategoriaMenu,
    private authService: AuthService,) { }

  ngOnInit(): void {
    this.getAllMenus();
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  categoriaMenu(): CategoriaMenu[] {
    return this.listCategoriaMenu.categoriaMenu;
  }

  getMenuListXCategoria(categoria:string): Menu[] {
    return this.menuList.filter((menu) => menu.categoria == categoria);
  }

  getAllMenus() {
    return this.menuServices.getAllMenus()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.menuList = result;
        //console.log("getAllMenus", this.menuList)
      });
  }


}
