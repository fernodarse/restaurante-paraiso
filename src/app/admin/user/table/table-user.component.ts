import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Observable, Observer } from 'rxjs';
import { MODES, SharedState, SHARED_STATE } from 'src/app/models/sharedState.model';
import { UserRestService } from 'src/app/models/user-rest.service';
import { Role } from 'src/app/models/staticts';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { PageEvent } from '@angular/material/paginator';
import { AppUser } from 'src/app/models/appuser';
import { UserService } from 'src/app/models/user.service';

@Component({
  selector: 'table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css']
})
export class TableUserComponent {

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

  constructor(private userServices: UserService,
    @Inject(SHARED_STATE) public observer: Observer<SharedState>,
    private snackBarService: SnackbarService,) {
    this.config = {
      currentPage: this.currentPage,
      itemsPerPage: this.pageSize //? +this.pageSize : this.pageSizeOptions[0]
    };
  }

  pageChange(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex + 1;
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
    this.length = list.length
    return list
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

}
