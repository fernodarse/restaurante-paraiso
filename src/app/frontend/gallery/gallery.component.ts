import { Component, OnInit } from '@angular/core';
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/models/evento.service';
declare var $: any
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  eventosList:Evento[];
  constructor(private eventoServices: EventoService,) {
    
   }

  ngOnInit(): void {
    this.eventosList=this.eventoServices.getAllEventos();
    // initialization of cubeportfolio
    $.HSCore.components.HSCubeportfolio.init('.cbp');
  }

  eventos(){
    let eventos=this.eventoServices.getAllEventos();
    console.log("eventos ",eventos)
    return eventos;
  }

}
