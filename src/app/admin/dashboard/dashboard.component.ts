import { Component, OnInit } from '@angular/core';
declare var $: any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // initialization of custom select
    $('.js-select').selectpicker();

    // initialization of hamburger
    $.HSCore.helpers.HSHamburgers.init('.hamburger');

    // initialization of charts
    $.HSCore.components.HSAreaChart.init('.js-area-chart');
    $.HSCore.components.HSDonutChart.init('.js-donut-chart');
    $.HSCore.components.HSBarChart.init('.js-bar-chart');

    // initialization of sidebar navigation component
    $.HSCore.components.HSSideNav.init('.js-side-nav', {
      afterOpen: function () {
        setTimeout(function () {
          $.HSCore.components.HSAreaChart.init('.js-area-chart');
          $.HSCore.components.HSDonutChart.init('.js-donut-chart');
          $.HSCore.components.HSBarChart.init('.js-bar-chart');
        }, 400);
      },
      afterClose: function () {
        setTimeout(function () {
          $.HSCore.components.HSAreaChart.init('.js-area-chart');
          $.HSCore.components.HSDonutChart.init('.js-donut-chart');
          $.HSCore.components.HSBarChart.init('.js-bar-chart');
        }, 400);
      }
    });

    // initialization of range datepicker
    $.HSCore.components.HSRangeDatepicker.init('#rangeDatepicker, #rangeDatepicker2, #rangeDatepicker3');

    // initialization of datepicker
    $.HSCore.components.HSDatepicker.init('#datepicker', {
      dayNamesMin: [
        'SU',
        'MO',
        'TU',
        'WE',
        'TH',
        'FR',
        'SA'
      ]
    });

    // initialization of HSDropdown component
    $.HSCore.components.HSDropdown.init($('[data-dropdown-target]'), { dropdownHideOnScroll: false });

    // initialization of custom scrollbar
    $.HSCore.components.HSScrollBar.init($('.js-custom-scroll'));

    // initialization of popups
    $.HSCore.components.HSPopup.init('.js-fancybox', {
      btnTpl: {
        smallBtn: '<button data-fancybox-close class="btn g-pos-abs g-top-25 g-right-30 g-line-height-1 g-bg-transparent g-font-size-16 g-color-gray-light-v3 g-brd-none p-0" title=""><i class="hs-admin-close"></i></button>'
      }
    });
  }

}
