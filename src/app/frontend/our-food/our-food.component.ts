import { Component, OnInit } from '@angular/core';
declare var $: any
@Component({
  selector: 'app-our-food',
  templateUrl: './our-food.component.html',
  styleUrls: ['./our-food.component.css']
})
export class OurFoodComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // initialization of tabs
    $.HSCore.components.HSTabs.init('[role="tablist"]');
    $('#ourFood [role="tablist"] .nav-link').on('click', function () {
      setTimeout(function () {
        $('#ourFoodTabs .js-carousel').slick('setPosition');
      }, 200);
    });
  }

}
