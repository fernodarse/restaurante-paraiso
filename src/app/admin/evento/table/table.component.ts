import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Sort } from '@angular/material/sort';
import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/component/confirm-dialog/confirm-dialog.component';
import { Evento } from 'src/app/models/evento';
import { EventoRestService } from 'src/app/models/evento-rest.service';
import { MODES, SharedState, SHARED_STATE } from 'src/app/models/sharedState.model';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'table-evento',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableEventoComponent implements OnInit {


  list: Evento[];
  filtro: boolean = false;

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

  sort: Sort;
  find: string = '';

  constructor(private eventoServices: EventoRestService,
    @Inject(SHARED_STATE) public observer: Subject<SharedState>,
    private snackBarService: SnackbarService,public dialog: MatDialog) {
    this.config = {
      currentPage: this.currentPage,
      itemsPerPage: this.pageSize 
    };
    observer.subscribe((update) => {
      console.log('recibiendo para buscar', update.id)
      if (update.mode == MODES.FIND) {
        if (update.id != undefined) {
          this.find = update.id.toLowerCase();
          this.currentPage = 0;
        }

      }
    });
  }

  pageChange(pageEvent: PageEvent) {
    console.log('nueva pagina', pageEvent);
    console.log('nueva config', this.config);
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    
  }


  getEvento(key: string): Observable<Evento> {
    return this.eventoServices.getEventobyId(key);
  }

  getEventoList(): Evento[] {
    let list = this.eventoServices.getAllEventos();
    list = list.filter((evnto) => this.filtro == false || evnto.destacado == this.filtro);
    list = list.filter((evnto) => evnto.name.toLowerCase().indexOf(this.find) !== -1)

    this.length = list.length;
    list = this.sortData(this.sort, list)
    return list;
  }

  Change(completed: boolean) {
    //console.log("checked: " + completed);
    this.currentPage = 0;
  }

  getAllEventos() {
    /*return this.eventoServices.getAllEventos()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.list = result;
        this.length = this.list.length;
        console.log("getAllMenus", this.list)
        console.log("cantidad de elementos", this.length)
      });*/
  }

  openDialog(key: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {msg: "¿Desea eliminar completamente el Evento?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.deleteEvento(key);
      }
    });
  }

  deleteEvento(key: string) {
    this.eventoServices.deleteEvento(key).then(
      () => {
        this.snackBarService.openSnackBar('El evnto se eliminó correctamente');
      }
    );
  }
  editEvento(key: string) {
    this.observer.next(new SharedState(MODES.EDIT, key));
  }
  createEvento() {
    this.observer.next(new SharedState(MODES.CREATE));
  }

  ngOnInit(): void {
    //this.getAllEventos();
    this.eventoServices.init()
    this.list = this.eventoServices.getAllEventos()
  }

  changeSort(sort: Sort){
    this.sort=sort;
  }
  
  sortData(sort: Sort, data: Evento[]) {
    if (!sort || !sort.active || sort.direction === '') {
      return data;
    }

    data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'descripcion': return this.compare(a.descripcion, b.descripcion, isAsc);
        case 'destacado': return this.compare(a.destacado ? 1 : 0, b.destacado ? 1 : 0, isAsc);        
        default: return 0;
      }
    });
    return data;

  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
