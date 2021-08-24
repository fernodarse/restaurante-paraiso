import { Component, OnInit } from '@angular/core';
import { CommentService } from 'src/app/models/comment.service';
declare var $: any

@Component({
  selector: 'app-coment',
  templateUrl: './coment.component.html',
  styleUrls: ['./coment.component.css']
})
export class ComentComponent implements OnInit {

  listLengt: number = 0
  pagina: number = 1;
  tamanoPagina: number = 10
  loading=false;

  constructor(private commentServices: CommentService) { }

  ngOnInit(): void {
    this.commentServices.loadData()
      .subscribe(() => {
        // initialization of carousel
        $.HSCore.components.HSCarousel.init('.js-carousel3');
      })
  }

  getCommentList(pagina: number) {
    let list = this.commentServices.getActiveComments()
    this.listLengt = list.length;
    //console.log('posiciones', pagina * this.tamanoPagina - this.tamanoPagina, pagina * this.tamanoPagina)
    //if(this.pagina>0 && this.pagina<=list.length/this.tamanoPagina)
    let result = list.slice(pagina * this.tamanoPagina - this.tamanoPagina, pagina * this.tamanoPagina);
    //console.log('mostrando ', result.length)
    return result
    return list;
  }

  cambiarPagina(page: number, event) {
    this.pagina = page;
    this.loading=true;
    $('.js-carousel3').slick('unslick');
    setTimeout(() => {
      this.loading=false;
      $.HSCore.components.HSCarousel.init('.js-carousel3');
    }, 2000);
    
  }

  getClasses(pagina:number){
    return pagina < 1 || pagina > this.cantidadPagina() ? 'g-color-gray-dark-v5' : 'g-color-primary'
  }

  ocultar(){
    return this.loading ? 'ocultar' : '';
  }
  
  cantidadPagina(){
    return this.listLengt%this.tamanoPagina == 0 ? this.listLengt/this.tamanoPagina : (this.listLengt/this.tamanoPagina) + 1
  }

}
