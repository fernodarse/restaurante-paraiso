import { Injectable } from '@angular/core';
import { Evento } from '../models/evento';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Booking } from './booking';

@Injectable({
  providedIn: 'root'
})

export class BookingService {

  private list: Booking[] = [];
  private unsubscribe$ = new Subject<void>();
  
  constructor(private db: AngularFirestore) {
    const list = this.db.collection<Booking>('bookings', ref =>
    ref.orderBy('date', 'desc')) //createdDate
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(
          c => ({
              bookingId: c.payload.doc.id,
            ...c.payload.doc.data()
          }));
      })).subscribe(result => {
        this.list=result;
        console.log("getAllBookings", this.list)
      });
   }

  create(booking: Booking) {
    const bookingData = JSON.parse(JSON.stringify(booking));
    console.log("createBooking ", bookingData);
    return this.db.collection('bookings').add(bookingData);
  }

  getAllBookings(): Booking[] {    
    return this.list;
  }

  getBookingbyId(id: string): Observable<Booking> {
    console.log("id ", id);  
    const bookingDetails = this.db.doc<Booking>('bookings/' + id).valueChanges(); 
    console.log("bookingDetails ", bookingDetails);   
    return bookingDetails;
  }

  deleteBooking(bookingId: string) {
    return this.db.doc('bookings/' + bookingId).delete();
  }

  updateBooking(Id: string, booking: Booking) {
    const putData = JSON.parse(JSON.stringify(booking));
    return this.db.doc('bookings/' + Id).update(putData);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
