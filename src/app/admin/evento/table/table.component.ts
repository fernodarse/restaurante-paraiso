import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/models/evento.service';
import { MODES, SharedState, SHARED_STATE } from 'src/app/models/sharedState.model';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'table-evento',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableEventoComponent implements OnInit {

  
  filtro: boolean = false;

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

  constructor(private eventoServices: EventoService,
    @Inject(SHARED_STATE) public observer: Observer<SharedState>,
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


  getEvento(key: string): Observable<Evento> {
    return this.eventoServices.getEventobyId(key);
  }

  getEventoList(): Evento[] {
    let list=this.eventoServices.getAllEventos()
    this.length=list.length;
    return list.filter((evnto) => this.filtro == false || evnto.destacado == this.filtro);
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
    this.getAllEventos();    
  }

}
