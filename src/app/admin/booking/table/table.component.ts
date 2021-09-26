import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PageEvent } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Sort } from '@angular/material/sort';
import { Observable, Observer, Subject } from 'rxjs';
import { Booking } from 'src/app/models/booking';
import { BookingService } from 'src/app/models/booking.service';
import { MODES, SharedState, SHARED_STATE } from 'src/app/models/sharedState.model';
import { SnackbarService } from 'src/app/services/snackbar.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';

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
  currentPage = 0;

  //spiner
  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;

  filterDate;//=new Date()
  sort: Sort;
  find: string = '';

  constructor(private bookingServices: BookingService,
    @Inject(SHARED_STATE) public observer: Subject<SharedState>,
    private snackBarService: SnackbarService,
    private datePipe: DatePipe) {
    this.config = {
      currentPage: this.currentPage,
      itemsPerPage: this.pageSize
    };
    observer.subscribe((update) => {
      console.log('recibiendo para buscar', update.id)
      if (update.mode == MODES.FIND) {
        if (update.id != undefined) {
          this.find = update.id.toLowerCase();
          this.currentPage = 0;
        }

      }
    });
  }

  pageChange(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex + 1;
    this.pageSize = pageEvent.pageSize;
  }


  getBooking(key: string): Observable<Booking> {
    return this.bookingServices.getBookingbyId(key);
  }

  getBookingList(): Booking[] {
    //console.log('this.find',this.find)
    let list = this.bookingServices.getAllBookings()
    list = list.filter(
      (reserva) =>
        (this.filterDate == undefined || this.compararFechas(new Date(reserva.date), this.filterDate)));

    list = list.filter((reserva) => reserva.name.toLowerCase().indexOf(this.find) !== -1)
    this.length = list.length;
    list = this.sortData(this.sort, list)
    return list;
  }

  compararFechas(fecha1: Date, fecha2: Date) {
    return fecha1.getFullYear() == fecha2.getFullYear() && fecha1.getMonth() == fecha2.getMonth() && fecha1.getDate() == fecha2.getDate()
  }

  async deleteBooking(key: string) {
    /* this.bookingServices.deleteBooking(key).then(
      () => {
        this.snackBarService.openSnackBar('El booking se eliminó correctamente');
      }
    );*/
    (await this.bookingServices.deleteBooking(key)).subscribe(
      (resp) => {
        console.log('respuesta del booking', resp)
        this.snackBarService.openSnackBar(resp.message);
      })
  }
  editBooking(key: string) {
    this.observer.next(new SharedState(MODES.EDIT, key));
  }
  createBooking() {
    this.observer.next(new SharedState(MODES.CREATE));
  }

  filtrarFecha(event: MatDatepickerInputEvent<Date>) {
    this.filterDate = event.value;
    this.currentPage = 0;
  }

  ngOnInit(): void {
    this.list = this.bookingServices.getAllBookings()
  }

  changeSort(sort: Sort) {
    this.sort = sort;
  }
  sortData(sort: Sort, data: Booking[]) {
    if (!sort || !sort.active || sort.direction === '') {
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

  @ViewChild('htmlData') htmlData: ElementRef;
  submit: boolean = false;

  public openPDF2(): void {
    let DATA = this.htmlData.nativeElement//document.getElementById('htmlData');
    let fecha = '';
    if (this.filterDate != null) {
      fecha = this.datePipe.transform(this.filterDate, 'MM-dd-yyyy', "America/New_York");
    }

    html2canvas(DATA).then(canvas => {

      let fileWidth = 208;
      console.log('longitud element', canvas.height)
      let fileHeight = canvas.height * fileWidth / canvas.width;
      console.log('longitud calculada', fileHeight)
      fileHeight = canvas.height;
      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

      PDF.save('Reserva-' + fecha + '.pdf');
    });
  }

  downloadPDF() {
    // Extraemos el
    const DATA = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    /*html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
    });*/
    html2canvas(DATA,options).then(function(canvas){
      var imgData = canvas.toDataURL('image/png');
      console.log('canvas.width', canvas.width)
      console.log('canvas.height', canvas.height)
      var pageHeight = 295;  
      var imgWidth = (canvas.width * 50) / 210 ; 
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      console.log('heightLeft', heightLeft)
      var position = 15;
  
      console.log('1er pag', position, imgWidth, imgHeight)
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          console.log('otra pag', position, imgWidth, imgHeight)
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight; 
      }
      doc.output('dataurlnewwindow');
      doc.save(Date.now() +'.pdf');
    });
  }

  public openPDF(): void {
    this.submit=true;
    let DATA = this.htmlData.nativeElement;
    let fecha = '';
    if (this.filterDate != null) {
      fecha = '-'+this.datePipe.transform(this.filterDate, 'MM-dd-yyyy', "America/New_York");
    }
    let doc = new jsPDF('p', 'px', 'a4');
    let htmlTable=this.getData()
    //DATA.innerHTML
    doc.html(htmlTable, {
      callback: function (doc) {
        doc.save('Reserva' + fecha + '.pdf');
      },
      x: 0,
      y: 0,
      margin: [10,0,10,1],
      //width: 1120,
    }).then((resp)=>{
      console.log('la resp', resp)
      this.submit=false;
    });
    //doc.output('dataurlnewwindow');
  }
//<th class="col-2" mat-sort-header="fCreada">Creada</th>
//<td class="text-center col-2" style="padding-bottom: 0px;padding-top: 0px;padding-left: 0px;
// adding-right: 0px;">${ this.datePipe.transform(menu.createdDate, 'mediumDate', "America/New_York") }</td> 
  getData(){
    let list=this.getBookingList();
    let html = `<table class="table u-table--v3 u-editable-table--v1 g-color-black table-sm table-striped" 
    style="width: 445px;">
    <thead>
      <tr>
        <th class="col-3"  colspan="2" >Nombre</th>
        <th class="col-3"  style="">Fecha</th>
        <th class="col-1"  style=" width: 5px;"> # </th>        
        <th class="col-5"  style="padding-left: 60px;" colspan="2" >Nota</th>
      </tr>
    </thead>
    <tbody style="font-size: 8px;">`;
    list.forEach((menu, index) => {
      let reserva = `<tr >
        <td class="text-center col-3" style="padding-bottom: 0px;padding-top: 0px;" colspan="2" >${menu.name}, ${ this.datePipe.transform(menu.createdDate, 'mediumDate', "America/New_York") }</td>
        <td class="text-center col-3" style="padding-bottom: 0px;padding-top: 0px;padding-left: 0px;
        padding-right: 0px;">${ this.datePipe.transform(menu.date, 'mediumDate', "America/New_York") }, ${ this.datePipe.transform(menu.time, 'shortTime', "America/New_York") } </td>
        <td class="text-center col-1" style="padding-bottom: 0px;padding-top: 0px; padding-left: 2px;
        padding-right: 2px;">${menu.cantPersonas}</td>
               
        <td class="text-center col-3" style="padding-bottom: 0px;padding-top: 0px; padding-left: 0px;
        padding-right: 2px;" colspan="2">${menu.mensaje}</td>
      </tr>`;
       
      html += reserva 
      if (index == list.length) {
        html += '</tbody></table>'
      }
    });
    return html;
}
}
