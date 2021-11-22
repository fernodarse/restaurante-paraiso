import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/models/menu';
import { MenuRestService } from 'src/app/models/menu-rest.service';
declare var $: any


@Component({
  selector: 'app-special',
  templateUrl: './special.component.html',
  styleUrls: ['./special.component.css']
})
export class SpecialComponent implements OnInit {

  especiales:Menu[];
  constructor(private menuServices: MenuRestService) { }

  getSpeciales(){
    return this.menuServices.getDestacados();
  }

  ngOnInit(): void {
    this.menuServices.loadData()
    .subscribe(() => {
      // initialization of carousel
    $.HSCore.components.HSCarousel.init('.js-carousel2');
    })
  }

}
