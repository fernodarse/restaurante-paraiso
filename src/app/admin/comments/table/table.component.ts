import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Observable, Observer, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { Comments } from 'src/app/models/comment';
import { CommentService } from 'src/app/models/comment.service';
import { Menu } from 'src/app/models/menu';
import { MenuService } from 'src/app/models/menu.service';
import { MODES, SharedState, SHARED_STATE } from 'src/app/models/sharedState.model';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'table-comments',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  private commetList: Comments[] = [];
  menuList: Menu[] = [];
  private unsubscribe$ = new Subject<void>();
  selectedMenuId:String='';

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

  myControl = new FormControl();
  filteredOptions: Observable<Menu[]>;

  constructor(private commentServices: CommentService,
    @Inject(SHARED_STATE) public observer: Observer<SharedState>,
    private snackBarService: SnackbarService,
    private menuServices: MenuService,) {
    this.config = {
      currentPage: this.currentPage,
      itemsPerPage: this.pageSize
    };
  }

  pageChange(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex + 1;
    this.pageSize = pageEvent.pageSize;
    console.log('nueva pagina', pageEvent);
    console.log('nueva config', this.config);
  }

  ngOnInit(): void {
    this.getAllComment();
    this.getAllMenus();
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): Menu[] {
    const filterValue = value.toLowerCase();     
    const select =  this.menuList.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0)
    
    const menuFiltrado = select.filter(option => option.nombre.toLowerCase() == filterValue)
    if(menuFiltrado.length>0 ){
      console.log('filtrando ')
      this.selectedMenuId = menuFiltrado[0].menuId;
    }else{
      this.selectedMenuId='';
    }
    return select;
  }

  getCommentList() {
    return this.commetList.filter((c) => this.selectedMenuId == '' || c.menuId == this.selectedMenuId);;
  }
  getAllComment() {
    return this.commentServices.getAllComments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.commetList = result;
        this.length = this.commetList.length;
        console.log("getAllComment", this.commetList)
        console.log("cantidad de elementos", this.length)
      });
  }

  deleteComment(key: string) {
    this.commentServices.deleteSingleComment(key).then(
      () => {
       this.snackBarService.openSnackBar('El comentario se eliminó correctamente');
      }
      );
  } 
  verComment(key: string) {
    this.observer.next(new SharedState(MODES.EDIT, key));
  }

  cambiarEstado(comment: Comments){
    comment.activo= !comment.activo;
    console.log('cambiando estado '+comment.activo)

    this.commentServices.updateComment(comment.commentId,comment).then(
      () => {
        this.snackBarService.openSnackBar('El comentario se ha '+ (comment.activo ? 'activado' : 'desactivado'));
      }
      );
  }     

  getAllMenus() {
    return this.menuServices.getAllMenus()
      .subscribe(result => {
        this.menuList = result;
        console.log("menus para buscar coments", this.menuList)
      });
  }

}
