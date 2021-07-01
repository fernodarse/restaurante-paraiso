import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Booking } from 'src/app/models/booking';
import { BookingService } from 'src/app/models/booking.service';
import { NativeDateAdapter, DateAdapter,  MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate } from '@angular/common';

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);
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
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}
]
})
export class BookingComponent implements OnInit {

  booking:Booking=new Booking();
  message: string;
  today = new Date()
  minDate = new Date(this.today);  
  maxDate = new Date();
  minTime;  
  maxTime;
  constructor(private bookingService: BookingService,private datePipe: DatePipe,) {
    console.log('hoy es ',this.today)
    this.minDate.setDate(this.today.getDate()+1);
    this.today.getFullYear
    let year = this.today.getFullYear();
    let month = this.today.getMonth();
    let day = this.today.getDate()
    this.maxDate=new Date(year+1,month,day)
    this.minTime=new Date(year,month,day,11,0,0,)//this.datePipe.transform(Date.now(), 'HH:mm');
    this.maxTime=new Date(year,month,day,20,0,0,)//this.datePipe.transform(Date.now(), 'HH:mm');
   }

  async onSubmit(form: NgForm): Promise<void> {
    this.message = '';
    if (form.valid) {
      console.log('datos del booking', this.booking,this.datePipe.transform(this.booking.time, 'HH:mm'))
      this.booking.createdDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm');
        this.bookingService.create(this.booking).then(
          () => {
            this.message ='La reserva se ha registrado correctamente'
          setTimeout(function () {
            this.message = '';
          }.bind(this), 9500);
          this.resetForm()
          form.resetForm()
          }
          );        
    }
  }

  resetForm() {
    this.booking = new Booking();
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
        }
      }
    }
    //console.log('errores ',messages)
    return messages;
  }

  ngOnInit(): void {
    
  }

}
