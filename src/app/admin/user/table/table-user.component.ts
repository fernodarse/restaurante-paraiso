import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Observable, Observer, Subject } from 'rxjs';
import { MODES, SharedState, SHARED_STATE } from 'src/app/models/sharedState.model';
import { UserRestService } from 'src/app/models/user-rest.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { PageEvent } from '@angular/material/paginator';
import { AppUser } from 'src/app/models/appuser';
import { Sort } from '@angular/material/sort';
import { ConfirmDialogComponent } from 'src/app/component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css']
})
export class TableUserComponent implements OnInit {

  categoria: string = '';

  //paginado
  length = 0;
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

  constructor(private userServices: UserRestService,
    @Inject(SHARED_STATE) public observer: Subject<SharedState>,
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
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    console.log('nueva pagina', pageEvent);
    console.log('nueva config', this.config);
  }


  getUser(key: string): Observable<AppUser> {
    return this.userServices.getUserbyId(key);
  }

  getUserList(): AppUser[] {
    let list = this.userServices.getAllUser()
    //.filter((menu) => this.categoria == '' || menu.categoria == this.categoria);
    list = list.filter((user) =>  user.name.toLowerCase().indexOf(this.find) !== -1 )  
    this.length = list.length;    
    list=this.sortData(this.sort,list)
    return list
  }

  openDialog(key: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {msg: "¿Desea eliminar completamente el Usuario?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.deleteUser(key);
      }
    });
  }

  deleteUser(key: string) {
    this.userServices.deleteUser(key).then(
      () => {
        console.log('El Usurio se eliminó correctamente')
        this.snackBarService.openSnackBar('El Usurio se eliminó correctamente');
      }
    );
  }
  editUser(key: string) {
    this.observer.next(new SharedState(MODES.EDIT, key));
  }
  createUser() {
    this.observer.next(new SharedState(MODES.CREATE));
  }

  changeSort(sort: Sort){
    this.sort=sort;
  }

  sortData(sort: Sort, data:AppUser[]) {
      if (!sort || !sort.active || sort.direction === '') {
        return data;
      }
  
      data = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name': return this.compare(a.name, b.name, isAsc);
          case 'rol': return this.compare(a.rol, b.rol, isAsc);
          case 'email': return this.compare(a.email, b.email, isAsc);
          default: return 0;
        }
      });
      return data;
    
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngOnInit(): void {
    this.userServices.init();
  }

}
