import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/models/evento.service';
declare var $: any
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  height: number;
  constructor(private eventoServices: EventoService, private elementRef: ElementRef,) {
    console.log('Constructor Galery');

  }

  ngOnInit(): void {
    this.eventoServices.loadData()
      .subscribe(() => {
        console.log('initialization of cubeportfolio');
        // initialization of cubeportfolio
        $.HSCore.components.HSCubeportfolio.init('.cbp');
        console.log('OnSubscribe Evento');
      })
    this.initHeight();
    console.log('OnInit Evento');
  }

  eventos() {
    let list = this.eventoServices.getEventosActivos();
    //console.log('eventos recibidos',list)
    return list;
  }

  imagenEvento(evento: Evento): String {
    return evento.photoURL != "" ? evento.photoURL : "../../../assets/img-temp/560x560/img1.jpg"
  }

  onResize(event) {
    console.log('onResize', event.target.innerWidth);
    this.resize()
  }

  resize() {
    let elem = this.elementRef.nativeElement.getElementsByClassName('img-f')[0] as HTMLElement
    if (elem != undefined) {
      var width = elem.offsetWidth;
      if (width != 0) {
        this.height = width
      }
    }
  }

  initHeight() {
    let anchoPantalla = window.innerWidth
    if (anchoPantalla <= 500) {
      this.height = anchoPantalla
    }
    if (anchoPantalla > 500 && anchoPantalla < 800) {
      this.height = anchoPantalla / 2
    }
    if (anchoPantalla > 800) {
      this.height = anchoPantalla / 5
    }

  }

}
