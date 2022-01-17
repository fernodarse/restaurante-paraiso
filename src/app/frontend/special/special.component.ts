import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Menu } from 'src/app/models/menu';
import { MenuRestService } from 'src/app/models/menu-rest.service';
import { MODES, SharedState, SHARED_STATE } from 'src/app/models/sharedState.model';
declare var $: any


@Component({
  selector: 'app-special',
  templateUrl: './special.component.html',
  styleUrls: ['./special.component.css']
})
export class SpecialComponent implements OnInit {

  especiales:Menu[];
  constructor(private menuServices: MenuRestService,
    @Inject(SHARED_STATE) public observer: Subject<SharedState>,) { }

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

  editBooking(key: string) {
    this.observer.next(new SharedState(MODES.FIND, key));
  }

}
