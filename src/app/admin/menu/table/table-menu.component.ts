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
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.css']
})
export class TableMenuComponent implements OnInit {

  categoria: string = '';

  //paginado
  length = -1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  config: any;
  currentPage = 0;

  //spiner
  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;

  sort:Sort;
  find:string='';

  constructor(private menuServices: MenuService,
    @Inject(SHARED_STATE) public observer: Subject<SharedState>,
    private listCategoriaMenu: ListCategoriaMenu,
    private snackBarService: SnackbarService,public dialog: MatDialog) {
    this.config = {
      currentPage: this.currentPage,
      itemsPerPage: this.pageSize //? +this.pageSize : this.pageSizeOptions[0]
    };
    observer.subscribe((update) => {
      console.log('recibiendo para buscar', update.id)
      if (update.mode == MODES.FIND) {
        if (update.id != undefined ) {
          this.find=update.id.toLowerCase();
          this.currentPage = 0; 
        }
          
      }
    });
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
    list = list.filter((menu) =>  menu.nombre.toLowerCase().indexOf(this.find) !== -1) 
    this.length=list.length
    list=this.sortData(this.sort,list)
    return list
  }

  filtrar(){
    this.currentPage = 0;
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

  openDialog(key: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {msg: "¿Desea eliminar completamente el Menu?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.deleteMenu(key);
      }
    });
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
  categoriaClases(id: string) {
    let color:String;
    switch(id){
      case '0':{
        color= 'g-bg-dark-semi-transparent--shift';
        break;
      }
      case '1':{
        color= 'g-bg-lightblue-v3';
        break;
      } 
      case '2':{
        color= 'g-bg-lightred';
        break;
      }   
      case '3':{
        color= 'g-bg-lightblue-v2';
        break;
      }    
    }
    return color;
  }

  categoriaXId(id: string) {
    return this.listCategoriaMenu.categoriaXId(id);
  }

  categoriaMenu(): CategoriaMenu[] {
    return this.listCategoriaMenu.categoriaMenu;
  }

  changeSort(sort: Sort){
    this.sort=sort;
  }
  sortData(sort: Sort, data:Menu[]) {
      if (!sort || !sort.active || sort.direction === '') {
        return data;
      }
  
      data = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name': return this.compare(a.nombre, b.nombre, isAsc);
          case 'precio': return this.compare(a.precio, b.precio, isAsc);
          default: return 0;
        }
      });
      return data;
    
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
