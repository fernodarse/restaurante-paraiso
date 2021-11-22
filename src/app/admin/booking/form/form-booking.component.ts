import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from "@angular/forms";
import { MODES, SharedState, SHARED_STATE } from "../../../models/sharedState.model";
import { Observable } from "rxjs";
import { DatePipe } from '@angular/common';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Booking } from 'src/app/models/booking';
import { AuthService } from 'src/app/services/auth.service';
import { BookingRestService } from 'src/app/models/booking-rest.service';

@Component({
  selector: 'form-booking',
  templateUrl: './form-booking.component.html',
  styleUrls: ['./form-booking.component.css'],
  providers: [DatePipe]
})
export class FormBookingComponent implements OnInit {

  booking: Booking = new Booking();

  today = new Date(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}))
  minDate = new Date(this.today);
  maxDate = new Date();
  minTime;
  maxTime;
  timeV;

  constructor(private bookingServices: BookingRestService,
    @Inject(SHARED_STATE) public stateEvents: Observable<SharedState>,
    private datePipe: DatePipe,
    private snackBarService: SnackbarService,
    @Inject("autenticar") private authService: AuthService,) {

    stateEvents.subscribe((update) => {
      if (update.mode != MODES.FIND) {
        this.booking = new Booking();
        console.log('recibiendo en form', update);
        if (update.id != undefined) {
          this.bookingServices.getBookingbyId(update.id)
            .subscribe(result => {
              console.log('busqueda x id', result)
              Object.assign(this.booking, result);
              this.booking.bookingId = update.id;
              //this.booking.time=this.datePipe.transform(this.booking.time, 'MM-dd-yyyy HH:mm:ss');
              console.log("tiempo ", this.booking.time.getHours)
              let time = new Date(this.datePipe.transform(this.booking.time, 'MM-dd-yyyy HH:mm:ss',"America/New_York"))
              this.timeV = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), time.getHours(), time.getMinutes(), time.getSeconds())
              console.log("time ", this.timeV)
            },
              e => {
                this.bookingServices.checkErrorAccses(e)
                /*if((e as string).includes('Access Denied')){
                  console.error('Access Denied',e)
                  this.router.navigateByUrl('/login');
                }
                console.error('error en services',e)*/
              });
        } else {
          this.timeV = null
        }
        console.log('nuvo time', this.booking.time)
        this.editing = update.mode == MODES.EDIT;
      }
    });



  }

  editing: boolean = false;

  async submitForm(form: NgForm) {
    if (form.valid) {
      console.log('submit menu', this.booking);
      if (this.editing) {
        (await this.bookingServices.updateBooking(this.booking.bookingId, this.booking)).subscribe(
          (resp ) => {
            console.log('respuesta del booking', resp)
            this.snackBarService.openSnackBar((resp as any).message);
            this.resetForm(form);
          })
      } else {
        this.booking.createdDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm',"America/New_York");
        (await this.bookingServices.create(this.booking)).subscribe(
          (resp) => {
            console.log('respuesta del booking', resp)
            this.snackBarService.openSnackBar((resp as any).message);
            this.resetForm(form);
          })
      }

    }
  }
  resetForm(form: NgForm) {
    this.booking = new Booking();
    form.reset();
  }

  ngOnInit(): void {
    this.minDate.setDate(this.today.getDate() + 1);
    this.today.getFullYear
    let year = this.today.getFullYear();
    let month = this.today.getMonth();
    let day = this.today.getDate()
    this.maxDate = new Date(year + 1, month, day)
    this.minTime = new Date(new Date(year, month, day, 8, 0, 0,).toLocaleString("en-US", {timeZone: "America/New_York"}))
    this.maxTime = new Date(new Date(year, month, day, 20, 0, 0,).toLocaleString("en-US", {timeZone: "America/New_York"}))
  }

  timeChangeHandler(event) {
    this.booking.time = event;
  }

  getValidationMessages(state: any, thingName?: string) {
    let thing: string = state.path || thingName;//tiene el mombre del campo
    let messages: string[] = [];
    if (state.errors) {
      for (let errorName in state.errors) {
        switch (errorName) {
          case "required":
            messages.push(`Se <strong> requiere </strong> el campo ${thing}`);
            break;
          case "pattern":
            messages.push(`El ${thing} tiene error de formato`);
            break;
        }
      }
    }
    //console.log('errores ',messages)
    return messages;
  }

}
