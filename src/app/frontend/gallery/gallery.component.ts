import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit, SimpleChange } from '@angular/core';
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

  constructor(private eventoServices: EventoService,) {
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
    console.log('OnInit Evento');
  }

  eventos() {
    let list=this.eventoServices.getEventosActivos();
    //console.log('eventos recibidos',list)
    return list;
  }

  imagenEvento(evento: Evento): String {
    return evento.photoURL != "" ? evento.photoURL : "../../../assets/img-temp/560x560/img1.jpg"
  }

}
