import { Inject, Injectable } from '@angular/core';
import { Booking } from './booking';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestDataSource, REST_URL } from './rest.datasource';

@Injectable({
  providedIn: 'root'
})

export class BookingRestService extends RestDataSource {

  private list: Booking[] = [];
  private unsubscribe$ = new Subject<void>();
  
  constructor(http: HttpClient, @Inject(REST_URL) private url: string) {
    super(http);
    this.url = url + "booking/";
    super.sendRequest<Booking[]>("GET", this.url)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.list = result;
      console.log("getAllBooking", this.list)
    });
   }

  create(booking: Booking) {
    let data = super.sendRequest<Booking>("POST", this.url, booking)
    .subscribe(b => {
      if((b as any)._id) {
        booking.bookingId=(b as any)._id;
      }
      booking.createdDate=b.createdDate  
      console.log('booking recibido', b)
      Object.assign(booking,b)
      console.log('booking salvado', booking)  
      this.list.unshift(booking)   
    })  

    return of(booking).toPromise() ;
  }

  getAllBookings(): Booking[] {    
    return this.list;
  }

  getBookingbyId(id: string): Observable<Booking> {
    return super.sendRequest<Booking>("GET", `${this.url}id/${id}`);
  }

  deleteBooking(bookingId: string) {
    return this.sendRequest<Booking>("DELETE", `${this.url}${bookingId}`).toPromise().finally(() => {
      let index= this.list.findIndex(item => item.bookingId == bookingId);
      this.list.splice(index,1); 
    });
  }

  updateBooking(Id: string, booking: Booking) {
    console.log('booking a enviar', booking);
    let res=this.sendRequest<Booking>("PATCH", `${this.url}${Id}`, booking);
    res.subscribe((e)=>{
      console.log('modificado')
      let index= this.list.findIndex(item => item.bookingId == Id);
      Object.assign(booking,e)
      this.list.splice(index,1,booking);
    })
    return     res.toPromise() 
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
