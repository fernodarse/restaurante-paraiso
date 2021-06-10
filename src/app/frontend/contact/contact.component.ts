import { Component, OnInit } from '@angular/core';
declare var $: any
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $.HSCore.components.HSGMap.init('.js-g-map');
  }

}
