import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
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

  constructor(private bookingServices: BookingService,
    @Inject(SHARED_STATE) public observer: Observer<SharedState>,
    private snackBarService: SnackbarService,) {
    this.config = {
      currentPage: this.currentPage,
      itemsPerPage: this.pageSize 
    };
  }

  pageChange(pageEvent: PageEvent) {
    this.currentPage=pageEvent.pageIndex+1;
    this.pageSize=pageEvent.pageSize;
    console.log('nueva pagina', pageEvent);
    console.log('nueva config', this.config);
  }


  getBooking(key: string): Observable<Booking> {
    return this.bookingServices.getBookingbyId(key);
  }

  getBookingList(): Booking[] {
    let list=this.bookingServices.getAllBookings()
    this.length=list.length;
    return list/*.filter((evnto) => this.filtro == false || evnto.destacado == this.filtro)*/;
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

  ngOnInit(): void { 
  }

}
