import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { Evento } from 'src/app/models/evento';
import { EventoRestService } from 'src/app/models/evento-rest.service';
declare var $: any
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  height: number;
  constructor(private eventoServices: EventoRestService, private elementRef: ElementRef,) {
    //console.log('Constructor Galery');
  }
  ngOnInit(): void {
    this.eventoServices.loadData()
      .subscribe(() => {
        // initialization of cubeportfolio
        $.HSCore.components.HSCubeportfolio.init('.cbp');
      })
    this.initHeight();
    //console.log('OnInit Evento');
  }

  pagina: number = 1;
  tamanoPagina: number = 10
  listLengt: number= 0

  cambiarPagina(page: number, event) {
    this.pagina = page; 
    $("#grid-container").cubeportfolio('destroy');
    setTimeout(() => {
      $.HSCore.components.HSCubeportfolio.init('.cbp');
    }, 2000);
  }

  remove() {
    $("#grid-container").cubeportfolio('remove', $(`.grupo${this.pagina}`));//$(".cbp-item")
  }

  eventos(pagina: number) {
    let list = this.eventoServices.getAllEventos()//getEventosActivos();
    this.listLengt=list.length;
    //console.log('posiciones', pagina * this.tamanoPagina - this.tamanoPagina, pagina * this.tamanoPagina)
    //if(this.pagina>0 && this.pagina<=list.length/this.tamanoPagina)
    let result = list.slice(pagina * this.tamanoPagina - this.tamanoPagina, pagina * this.tamanoPagina);
    //.log('mostrando ', result.length)
    return result  
  }

  getClasses(pagina:number){
    return pagina < 1 || pagina > this.cantidadPagina() ? 'g-color-gray-dark-v5' : 'g-color-primary'
  }
  
  cantidadPagina(){
    return this.listLengt%this.tamanoPagina == 0 ? this.listLengt/this.tamanoPagina : (this.listLengt/this.tamanoPagina) + 1
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
