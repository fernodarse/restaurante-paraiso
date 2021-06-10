import { Component, OnInit } from '@angular/core';
declare var $: any

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    // initialization of header
    $.HSCore.components.HSHeader.init($('#js-header'));
    $.HSCore.helpers.HSHamburgers.init('.hamburger');


    // initialization of go to section
    $.HSCore.components.HSGoTo.init('.js-go-to');

    $(window).on('load', function () {
      console.log("load from header")
      // initialization of HSScrollNav
      $.HSCore.components.HSScrollNav.init($('#js-scroll-nav'), {
        duration: 700
      });
    });

    $(window).on('resize', function () {
      setTimeout(function () {
        $.HSCore.components.HSTabs.init('[role="tablist"]');
      }, 200);
    });

  }

}
