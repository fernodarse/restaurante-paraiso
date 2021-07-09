import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/models/menu';
import { MenuService } from 'src/app/models/menu.service';
declare var $: any


@Component({
  selector: 'app-special',
  templateUrl: './special.component.html',
  styleUrls: ['./special.component.css']
})
export class SpecialComponent implements OnInit {

  especiales:Menu[];
  constructor(private menuServices: MenuService) { 
    //this.especiales = this.getSpeciales();
    $.HSCore.components.HSCarousel.init('.js-carousel');
    $(document).on('ready', function() {
      $.HSCore.components.HSCarousel.init('.js-carousel');
      alert('mensake')
    });
    /*$(document).on('ready', function() {
      $(".js-carousel").slick({
        dots: true,
        vertical: true,
        slidesToShow: 3,
        slidesToScroll: 3
      });
      $("#special").click(alert('sadfa sda'))
    });*/
    /*$(document).ready(function(){
      $(".js-carousel").slick({
        dots: true,
        vertical: true,
        slidesToShow: 3,
        slidesToScroll: 3
      })
    });*/
   /* $(".js-carousel").slick({
      dots: true,
      vertical: true,
      slidesToShow: 3,
      slidesToScroll: 3
    });*/
  }

  getSpeciales(){
    return this.menuServices.getDestacados();
  }

  ngOnInit(): void {
    //this.especiales = this.getSpeciales();
    //$.HSCore.components.HSSlickCarousel.init('.js-carousel');
    
  }

  getSpecial(){
    return  `<div class="js-slide" >       
    <article class="row flex-items-middle text-center">
        <div class="col-lg-6 align-self-center g-mb-50">
            <div class="text-uppercase text-center u-heading-v5-3 u-heading-v5-color-primary u-heading-v5-rounded-50x g-mb-20">
                <h4 class="g-font-weight-700 g-font-size-12 g-color-white-opacity-0_7 g-mb-15">
                    From chef
                </h4>
                <h2 class="u-heading-v5__title g-line-height-1_2 g-font-weight-700 g-font-size-32 g-font-size-40--md g-color-white g-bg-white--before g-pb-40">
                    nombre 1
                </h2>
            </div>

            <div class="g-px-70--md">
                <p class="g-color-white-opacity-0_7 g-mb-25">
                    Sed feugiat porttitor nunc, non dignissim ipsum
                    vestibulum in. Donec in blandit dolor. Vivamus a fringilla lorem, vel faucibus ante.
                </p>
            </div>

            <strong class="d-block g-color-white g-font-size-26 g-mb-30">$14.00</strong>
            <button
                class="btn text-uppercase u-btn-white g-font-weight-700 g-font-size-11 g-theme-color-gray-dark-v2 g-brd-none rounded-0 g-px-30 g-py-25"
                type="submit">Book now</button>
        </div>

        <div class="col-lg-6">
            <img class="img-fluid g-width-360 g-width-auto--lg mx-auto"
                src="../../../assets/img-temp/700x700/img1.png" alt="Image description">
        </div>
    </article>
</div>

<div class="js-slide" >       
    <article class="row flex-items-middle text-center">
        <div class="col-lg-6 align-self-center g-mb-50">
            <div class="text-uppercase text-center u-heading-v5-3 u-heading-v5-color-primary u-heading-v5-rounded-50x g-mb-20">
                <h4 class="g-font-weight-700 g-font-size-12 g-color-white-opacity-0_7 g-mb-15">
                    From chef
                </h4>
                <h2 class="u-heading-v5__title g-line-height-1_2 g-font-weight-700 g-font-size-32 g-font-size-40--md g-color-white g-bg-white--before g-pb-40">
                   nombre
                </h2>
            </div>

            <div class="g-px-70--md">
                <p class="g-color-white-opacity-0_7 g-mb-25">
                    Sed feugiat porttitor nunc, non dignissim ipsum
                    vestibulum in. Donec in blandit dolor. Vivamus a fringilla lorem, vel faucibus ante.
                </p>
            </div>

            <strong class="d-block g-color-white g-font-size-26 g-mb-30">$14.00</strong>
            <button
                class="btn text-uppercase u-btn-white g-font-weight-700 g-font-size-11 g-theme-color-gray-dark-v2 g-brd-none rounded-0 g-px-30 g-py-25"
                type="submit">Book now</button>
        </div>

        <div class="col-lg-6">
            <img class="img-fluid g-width-360 g-width-auto--lg mx-auto"
                src="../../../assets/img-temp/700x700/img1.png" alt="Image description">
        </div>
    </article>
</div>
`;
  }

}
