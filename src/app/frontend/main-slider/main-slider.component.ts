import { Component, OnInit } from '@angular/core';
declare var $: any
declare var MasterSlider:any 

@Component({
  selector: 'app-main-slider',
  templateUrl: './main-slider.component.html',
  styleUrls: ['./main-slider.component.css']
})
export class MainSliderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("Frontend init");

    //JS Plugins Init.
    var promoSlider = new MasterSlider();

    promoSlider.setup('masterslider', {
      width: 1400,
      height: 1800,
      speed: 70,
      layout: 'fullscreen',
      loop: true,
      preload: 0,
      autoplay: false,
      layersMode: 'center'
    });

    promoSlider.control('lightbox');

    promoSlider.control('thumblist', {
      autohide: false,
      dir: 'h',
      align: 'top',
      width: 550,
      height: 50,
      margin: 0,
      space: 0,
      hideUnder: 500,
      type: 'tabs',
      inset: true

    });

    // initialization of carousel
    //$.HSCore.components.HSCarousel.init('.js-carousel');

    // initialization of go to section
    $.HSCore.components.HSGoTo.init('.js-go-to');

    $(window).on('resize', function () {
      setTimeout(function () {
        $.HSCore.components.HSTabs.init('[role="tablist"]');
      }, 200);
    });
  }

}
