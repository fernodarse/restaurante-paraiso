import { Component, OnInit } from '@angular/core';
declare var $: any
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // initialization of cubeportfolio
    $.HSCore.components.HSCubeportfolio.init('.cbp');
  }

}
