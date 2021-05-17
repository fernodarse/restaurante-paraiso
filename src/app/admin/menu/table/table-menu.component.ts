import { Component, OnInit, Inject } from '@angular/core';
import { Menu } from "../../../models/menu";
import { MenuService } from "../../../models/menu.service";
import { MODES, SharedState, SHARED_STATE } from "../../../models/sharedState.model";
import { Observable, Observer, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.css']
})
export class TableMenuComponent implements OnInit {

  private menuList: Menu[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private menuServices: MenuService,
    @Inject(SHARED_STATE) public observer: Observer<SharedState>) { }


  getMenu(key: string): Observable<Menu> {
    return this.menuServices.getMenubyId(key);
  }

  getMenuList(): Menu[] {
    return this.menuList;
  }

  getAllMenus() {
    return this.menuServices.getAllMenus()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.menuList = result;    
        console.log("getAllMenus",this.menuList )    
      });
  }

  deleteMenu(key: string) {
    this.menuServices.deleteMenu(key);
  }
  editMenu(key: string) {
    this.observer.next(new SharedState(MODES.EDIT, key));
  }
  createMenu() {
    this.observer.next(new SharedState(MODES.CREATE));
  }

  ngOnInit(): void {
    this.getAllMenus();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
