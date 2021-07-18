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
  currentPage = 1;

  //spiner
  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;

  filterDate;//=new Date()
  sort:Sort;

  constructor(private bookingServices: BookingService,
    @Inject(SHARED_STATE) public observer: Observer<SharedState>,
    private snackBarService: SnackbarService,) {
    this.config = {
      currentPage: this.currentPage,
      itemsPerPage: this.pageSize
    };    
  }

  pageChange(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex + 1;
    this.pageSize = pageEvent.pageSize;
  }


  getBooking(key: string): Observable<Booking> {
    return this.bookingServices.getBookingbyId(key);
  }

  getBookingList(): Booking[] {
    let list = this.bookingServices.getAllBookings()
    list = list.filter((reserva) => this.filterDate == undefined || this.compararFechas(new Date(reserva.date), this.filterDate));
    this.length = list.length;    
    list=this.sortData(this.sort,list)
    //console.log('this.filterDate',this.filterDate)
    return list;
  }

  compararFechas(fecha1: Date, fecha2: Date) {
    return fecha1.getFullYear() == fecha2.getFullYear() && fecha1.getMonth() == fecha2.getMonth() && fecha1.getDate() == fecha2.getDate()
  }

  deleteBooking(key: string) {
    this.bookingServices.deleteBooking(key).then(
      () => {
        this.snackBarService.openSnackBar('El booking se eliminó correctamente');
      }
    );
  }
  editBooking(key: string) {
    this.observer.next(new SharedState(MODES.EDIT, key));
  }
  createBooking() {
    this.observer.next(new SharedState(MODES.CREATE));
  }

  filtrarFecha(event: MatDatepickerInputEvent<Date>) {
    this.filterDate = event.value    
  }

  ngOnInit(): void {
  }

  changeSort(sort: Sort){
    this.sort=sort;
  }
  sortData(sort: Sort, data:Booking[]) {
   // const data = this.desserts.slice();
      /*if(!sort){

      }*/
      if (!sort || !sort.active || sort.direction === '') {
        //this.sortedData = data;
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
