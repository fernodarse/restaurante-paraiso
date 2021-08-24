import { Component, OnInit } from '@angular/core';
declare var $: any
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(window).on('load', function () {
      console.log("load from comment")
      // initialization of slick carousel
      $.HSCore.components.HSCarousel.init('.js-carousel1');
      //$.dzsprx_init('#prx1', { direction: "normal", mode_scroll:"fromtop"} );
    });
  }


}
