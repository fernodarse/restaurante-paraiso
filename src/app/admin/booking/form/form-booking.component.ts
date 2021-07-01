import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {  NgForm } from "@angular/forms";
import { MODES, SharedState, SHARED_STATE } from "../../../models/sharedState.model";
import { Observable } from "rxjs";
import { DatePipe } from '@angular/common';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { BookingService } from 'src/app/models/booking.service';
import { Booking } from 'src/app/models/booking';

@Component({
  selector: 'form-booking',
  templateUrl: './form-booking.component.html',
  styleUrls: ['./form-booking.component.css'],
  providers: [DatePipe] 
})
export class FormBookingComponent implements OnInit {

  booking: Booking = new Booking();

  today = new Date()
  minDate = new Date(this.today);  
  maxDate = new Date();
  minTime;  
  maxTime;
  timeV;

  constructor(private bookingServices: BookingService,
    @Inject(SHARED_STATE) public stateEvents: Observable<SharedState>,
    private datePipe: DatePipe,
    private snackBarService: SnackbarService,) {

    stateEvents.subscribe((update) => {
      this.booking = new Booking();
      console.log('recibiendo en form', update);
      if (update.id != undefined) {
        this.bookingServices.getBookingbyId(update.id).subscribe(result => {
          console.log('busqueda x id', result)
          Object.assign(this.booking, result);
          this.booking.bookingId = update.id;
          //this.booking.time=this.datePipe.transform(this.booking.time, 'MM-dd-yyyy HH:mm:ss');
          console.log("tiempo ", this.booking.time)
          this.timeV=new Date(this.datePipe.transform(this.booking.time, 'MM-dd-yyyy HH:mm:ss'))
          console.log("time ", this.timeV)
        });
      }else{
        this.timeV=null
      }
      console.log('nuvo time', this.booking.time)
      this.editing = update.mode == MODES.EDIT;
    });

    this.minDate.setDate(this.today.getDate()+1);
    this.today.getFullYear
    let year = this.today.getFullYear();
    let month = this.today.getMonth();
    let day = this.today.getDate()
    this.maxDate=new Date(year+1,month,day)
    this.minTime=new Date(year,month,day,11,0,0,)
    this.maxTime=new Date(year,month,day,20,0,0,)

  }

  editing: boolean = false;

  submitForm(form: NgForm) {
    if (form.valid) {
      console.log('submit menu', this.booking);
      if (this.editing) {
        this.bookingServices.updateBooking(this.booking.bookingId, this.booking).then(
          () => {
          this.snackBarService.openSnackBar('El booking se modificó correctamente');
          }
          );
      } else {
        this.booking.createdDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm');
        this.bookingServices.create(this.booking).then(
          () => {
          this.snackBarService.openSnackBar('El booking se creo satifactioramente');
          }
          );;
      }
      //form.reset();
      //this.resetForm();
    }
  }
  resetForm() {
    this.booking = new Booking();
  }

  ngOnInit(): void {
  }

  timeChangeHandler(event){
    this.booking.time=event;
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
