import { ThrowStmt } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PageEvent } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Sort } from '@angular/material/sort';
import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Booking } from 'src/app/models/booking';
import { BookingService } from 'src/app/models/booking.service';
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/models/evento.service';
import { MODES, SharedState, SHARED_STATE } from 'src/app/models/sharedState.model';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'table-booking',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableBookingComponent implements OnInit {


  list: Booking[];

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

  filterDate;//=new Date()
  sort:Sort;
  find:string='';

  constructor(private bookingServices: BookingService,
    @Inject(SHARED_STATE) public observer: Subject<SharedState>,
    private snackBarService: SnackbarService,) {
    this.config = {
      currentPage: this.currentPage,
      itemsPerPage: this.pageSize
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
    this.currentPage = pageEvent.pageIndex + 1;
    this.pageSize = pageEvent.pageSize;
  }


  getBooking(key: string): Observable<Booking> {
    return this.bookingServices.getBookingbyId(key);
  }

  getBookingList(): Booking[] {
    //console.log('this.find',this.find)
    let list = this.bookingServices.getAllBookings()
    list = list.filter(
      (reserva) => 
      (this.filterDate == undefined || this.compararFechas(new Date(reserva.date), this.filterDate)) );
    
    list = list.filter((reserva) =>  reserva.name.toLowerCase().indexOf(this.find) !== -1 )  
    this.length = list.length;    
    list=this.sortData(this.sort,list)
    return list;
  }

  compararFechas(fecha1: Date, fecha2: Date) {
    return fecha1.getFullYear() == fecha2.getFullYear() && fecha1.getMonth() == fecha2.getMonth() && fecha1.getDate() == fecha2.getDate()
  }

  async deleteBooking(key: string) {
    /* this.bookingServices.deleteBooking(key).then(
      () => {
        this.snackBarService.openSnackBar('El booking se eliminó correctamente');
      }
    );*/
    (await this.bookingServices.deleteBooking(key)).subscribe(
      (resp) => {
        console.log('respuesta del booking', resp)
        this.snackBarService.openSnackBar(resp.message);
      })
  }
  editBooking(key: string) {
    this.observer.next(new SharedState(MODES.EDIT, key));
  }
  createBooking() {
    this.observer.next(new SharedState(MODES.CREATE));
  }

  filtrarFecha(event: MatDatepickerInputEvent<Date>) {
    this.filterDate = event.value;
    this.currentPage = 0;    
  }

  ngOnInit(): void {
    this.list = this.bookingServices.getAllBookings()
  }

  changeSort(sort: Sort){
    this.sort=sort;
  }
  sortData(sort: Sort, data:Booking[]) {
      if (!sort || !sort.active || sort.direction === '') {
        return data;
      }
  
      data = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name': return this.compare(a.name, b.name, isAsc);
          case 'cliente': return this.compare(a.cantPersonas, b.cantPersonas, isAsc);
          case 'fCreada': return this.compare(new Date(a.createdDate).getTime(), new Date(b.createdDate).getTime(), isAsc);
          case 'date': return this.compare(new Date(a.date).getTime(), new Date(b.date).getTime(), isAsc);
          default: return 0;
        }
      });
      return data;
    
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
