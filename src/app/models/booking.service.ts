import { Injectable } from '@angular/core';
import { Evento } from '../models/evento';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Booking } from './booking';

@Injectable({
  providedIn: 'root'
})

export class BookingService {

  private list: Booking[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private db: AngularFirestore) {
    this.loadData().subscribe(result => {
          this.list = result;
          console.log("getAllBookings", this.list)
        });
  }

  loadData(){
    return this.db.collection<Booking>('bookings', ref =>
    ref.orderBy('date', 'desc')) //createdDate
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(
          c => ({
            bookingId: c.payload.doc.id,
            ...c.payload.doc.data()
          }));
      }))
  }

  async create(booking: Booking) {
    const bookingData = JSON.parse(JSON.stringify(booking));
    console.log("createBooking ", bookingData);
    let entity = (await this.db.collection('bookings').add(bookingData));
    return of({
      statusCode: 200,
      message: 'La reserva se ha registrado correctamente',
      entity: entity,
    })
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
