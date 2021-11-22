import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/evento';

@Component({
  selector: 'app-portafolio1',
  templateUrl: './portafolio1.component.html',
  styleUrls: ['./portafolio1.component.css']
})
export class Portafolio1Component implements OnInit {

  @Input("eventos") eventoList: Evento [];   
  
  height: number;

  constructor(private elementRef: ElementRef) { }

  eventos() {
    return this.eventoList;
  }
  ngOnInit(): void {
    this.initHeight();
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
