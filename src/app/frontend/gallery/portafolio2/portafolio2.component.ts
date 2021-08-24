import { Component, Input, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/evento';

@Component({
  selector: 'app-portafolio2',
  templateUrl: './portafolio2.component.html',
  styleUrls: ['./portafolio2.component.css']
})
export class Portafolio2Component implements OnInit {

  @Input("eventos") eventoList: Evento []; 

  constructor() { }

  eventos() {
    return this.eventoList;
  }

  imagenEvento(evento: Evento): String {
    return evento.photoURL != "" ? evento.photoURL : "../../../assets/img-temp/560x560/img1.jpg"
  }

  more(){
    return '<div class="logo cbp-item">my awesome content to append to plugin</div> <div class="logo cbp-item">my second awesome content to append to plugin</div>';
  }

  ngOnInit(): void {
  }

}
