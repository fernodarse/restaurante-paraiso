import { Inject, Injectable } from '@angular/core';
import { Booking } from './booking';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestDataSource, REST_URL } from './rest.datasource';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class BookingRestService extends RestDataSource {

  private list: Booking[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(http: HttpClient, @Inject(REST_URL) private url: string, public router: Router) {
    super(http, router);
    this.url = url + "booking/";
    this.loadData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.list = result;
        console.log("getAllBooking", this.list)
      });
  }

  loadData() {
    return super.sendRequest<Booking[]>("GET", this.url)
  }

  async create(booking: Booking) {
    let data = new Observable((observer) => {
      super.sendRequest<any>("POST", this.url, booking)
        .subscribe(respuesta => {
          observer.next(respuesta)
          console.log('subscribe services data ', respuesta)
          if ((respuesta as any).statusCode == 200) {
            let entity = (respuesta as any).entity
            if (entity) {
              booking.bookingId = entity._id;
            }
            booking.createdDate = entity.createdDate
            console.log('booking recibido', entity)
            Object.assign(booking, entity)
            console.log('booking salvado', booking)
            this.list.unshift(booking)
          }
        })
    })
    return data;
  }

  getAllBookings(): Booking[] {
    return this.list;
  }

  getBookingbyId(id: string): Observable<Booking> {
    return super.sendRequest<Booking>("GET", `${this.url}id/${id}`);
  }

  deleteBooking(bookingId: string) {
    /*return this.sendRequest<Booking>("DELETE", `${this.url}${bookingId}`)
      .toPromise()
      .finally(() => {
        let index = this.list.findIndex(item => item.bookingId == bookingId);
        this.list.splice(index, 1);
      });*/
    let data = new Observable((observer) => {
      this.sendRequest<Booking>("DELETE", `${this.url}${bookingId}`)
        .subscribe((respuesta) => {
          observer.next(respuesta)
          if ((respuesta as any).statusCode == 200) {
            let index = this.list.findIndex(item => item.bookingId == bookingId);
            this.list.splice(index, 1);
          }
        },
        e => {
          super.checkErrorAccses(e)
        }      
        )
    })
    return data;
  }

  updateBooking(Id: string, booking: Booking) {
    let data = new Observable((observer) => {
      this.sendRequest<Booking>("PATCH", `${this.url}${Id}`, booking)
        .subscribe((respuesta) => {
          observer.next(respuesta)
          if ((respuesta as any).statusCode == 200) {
            let entity = (respuesta as any).entity
            console.log('modificado')
            let index = this.list.findIndex(item => item.bookingId == Id);
            Object.assign(booking, entity)
            this.list.splice(index, 1, booking);
          }
        },
          e => {
            super.checkErrorAccses(e)
          }
        )
    })
    return data;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
