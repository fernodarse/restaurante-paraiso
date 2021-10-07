import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';
import { AppUser } from '../models/appuser';
import { MODES, SharedState, SHARED_STATE } from '../models/sharedState.model';
import { AuthService } from '../services/auth.service';
import { NgForm } from "@angular/forms";
import { AuthRestService } from '../services/auth-rest.service';
import { BookingService } from '../models/booking.service';
import { CommentService } from '../models/comment.service';
import { Booking } from '../models/booking';
import { Comments } from '../models/comment';
declare var $: any

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {

  key:string=''
  private listToday: Booking[] = [];
  private lastComents: Comments[] = [];

  constructor(@Inject("autenticar")private authService: AuthRestService,
  @Inject(SHARED_STATE) public observer: Observer<SharedState>,
  private bookingServices: BookingService,
  private commentServices: CommentService,) { }

  ngOnInit(): void {
    //this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
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

    this.bookingServices.getBookingsHoy().subscribe(result => {
      this.listToday = result;
      console.log("listToday", this.listToday)
    });

    this.commentServices.getLastComments()
    .subscribe(result => {
      this.lastComents = result;
      console.log("lastComents", this.lastComents)
    });
  }

  getUserAdmin(): any{
    //console.log('data', this.authService.getUserData())
    return this.authService.getUserData()
  }

  logoutAdmin(){
    //localStorage.removeItem('token');
    this.authService.logout()
   // this.router.navigate(['/']);
  }

  find(){
    console.log('buscando', this.key)
    this.observer.next(new SharedState(MODES.FIND, this.key))
  }

  getLastComments(){
    return this.lastComents
  }

  getLastCommentsLeght(){
    return this.getLastComments().length
  }

  getBookingHoy(){
     return  this.listToday
  }

  getBookingHoyLeght(){
     return this.getBookingHoy().length;
  }
}
