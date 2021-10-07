import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Booking } from 'src/app/models/booking';
import { BookingService } from 'src/app/models/booking.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/app/models/appuser';
import { Observable } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale,'-0400');
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ]
})
export class BookingComponent implements OnInit {

  appUser: AppUser;
  booking: Booking = new Booking();
  message: string;
  today = new Date(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}))
  minDate = new Date(this.today);
  maxDate = new Date();
  minTime;
  maxTime;
  timeDate: Date;

  @ViewChild('form') ngForm;
  submit: boolean = false;
  constructor(private bookingService: BookingService, private datePipe: DatePipe,
    @Inject("autenticar") private authService: AuthService,
    private snackBarService: SnackbarService,) {
    this.authService.appUser$.subscribe(appUser => {
      this.appUser = appUser;
      console.log('usuario bookin', this.appUser)
    });
    this.minDate.setDate(this.today.getDate() + 1);
    this.today.getFullYear
    let year = this.today.getFullYear();
    let month = this.today.getMonth();
    let day = this.today.getDate()
    this.maxDate = new Date(year + 1, month, day)
    this.minTime = new Date(new Date(year, month, day, 8, 0, 0,).toLocaleString("en-US", {timeZone: "America/New_York"}))
    this.maxTime = new Date(new Date(year, month, day, 20, 0, 0,).toLocaleString("en-US", {timeZone: "America/New_York"}))
  }

  async onSubmit(form: NgForm): Promise<void> {
    this.message = '';
    console.log('Submit action')
    if (form.valid) {
      this.submit = true;
      let time=  this.datePipe.transform(this.booking.date, 'MM-dd-yyyy',"America/New_York") + ' ' + this.datePipe.transform(this.timeDate, 'HH:mm',"America/New_York");
      this.booking.time = new Date(time);
      console.log('time +fecha', time/*this.datePipe.transform(time, 'MM-dd-yyyy HH:mm',"America/New_York")*/)
      
      console.log('datos del booking', this.booking, this.datePipe.transform(this.booking.time, 'HH:mm',"America/New_York"))
      console.log('datos del booking', this.booking, this.datePipe.transform(this.booking.time, 'MM-dd-yyyy HH:mm',"America/New_York"))
      this.booking.createdDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm',"America/New_York");
      try {
        (await this.bookingService.create(this.booking)).subscribe(
          /*() => {//para firebase
            this.message ='La reserva se ha registrado correctamente'
          setTimeout(function () {
            this.message = '';
          }.bind(this), 9500);
          this.resetForm()
          form.resetForm()
          }*/
          (resp) => {
            console.log('respuesta del booking', resp)
            this.submit = false;
            this.snackBarService.openSnackBar(resp.message);
            //this.message = resp.message
            /*setTimeout(function () {
              this.message = '';
            }.bind(this), 9500); */
            this.resetForm()

          }
        );
      } catch (Error) {
        console.log('error', Error)
        this.submit = false;
        this.snackBarService.openSnackBar('Se ha producido un error, intentelo más tarde');
      }
    }
  }

  resetForm() {
    this.booking = new Booking();
    this.ngForm.resetForm();
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
          case "matDatepickerParse":
            messages.push(`${thing} is not a valid date!`);
            break;
          case "matDatepickerMin":
            messages.push(`Minimum date should be ${this.datePipe.transform(this.minDate, 'dd-MMM-yyyy')}`);
            break;
          case "matDatepickerMax":
            messages.push(`Maximum  date should be ${this.datePipe.transform(this.maxDate, 'dd-MMM-yyyy')}`);
            break;
          case "pattern":
            messages.push(`Please provide a valid email address`);
            break;            
        }
      }
    }
    //console.log('errores ',messages)
    return messages;
  }

  ngOnInit(): void {

  }

  login() {
    this.authService.login();
  }
}
