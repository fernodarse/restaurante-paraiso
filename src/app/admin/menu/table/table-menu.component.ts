import { Component, OnInit, Inject } from '@angular/core';
import { Menu } from "../../../models/menu";
import { MenuService } from "../../../models/menu.service";
import { MODES, SharedState, SHARED_STATE } from "../../../models/sharedState.model";
import { Observable, Observer, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { CategoriaMenu, ListCategoriaMenu } from 'src/app/models/staticts';
import { PageEvent } from '@angular/material/paginator';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.css']
})
export class TableMenuComponent implements OnInit {

  categoria: string = '';

  //paginado
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  config: any;
  currentPage = 1;

  //spiner
  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;

  constructor(private menuServices: MenuService,
    @Inject(SHARED_STATE) public observer: Observer<SharedState>,
    private listCategoriaMenu: ListCategoriaMenu,
    private snackBarService: SnackbarService,) {
    this.config = {
      currentPage: this.currentPage,
      itemsPerPage: this.pageSize //? +this.pageSize : this.pageSizeOptions[0]
    };
  }

  pageChange(pageEvent: PageEvent) {
    this.currentPage=pageEvent.pageIndex+1;
    this.pageSize=pageEvent.pageSize;
    console.log('nueva pagina', pageEvent);
    console.log('nueva config', this.config);
  }


  getMenu(key: string): Observable<Menu> {
    return this.menuServices.getMenubyId(key);
  }

  getMenuList(): Menu[] {
    let list=this.menuServices.getAllMenus().filter((menu) => this.categoria == '' || menu.categoria == this.categoria);
    this.length=list.length
    return list
  }

  getAllMenus() {
    /*return this.menuServices.getAllMenus()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.menuList = result;
        this.length = this.menuList.length;
        console.log("getAllMenus", this.menuList)
        console.log("cantidad de elementos", this.length)
      });*/
      //this.menuList=this.menuServices.getAllMenus();
     // console.log("getAllMenus comp", this.menuList)
  }

  deleteMenu(key: string) {
    this.menuServices.deleteMenu(key).then(
      () => {
       console.log('El menú se eliminó correctamente')
       this.snackBarService.openSnackBar('El menú se eliminó correctamente');
      }
      );
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

  /*ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }*/

  categoriaXId(id: string) {
    return this.listCategoriaMenu.categoriaXId(id);
  }

  categoriaMenu(): CategoriaMenu[] {
    return this.listCategoriaMenu.categoriaMenu;
  }

}
