import { Component, OnInit } from '@angular/core';
declare var $: any
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  location: any[][] = [];
  //markers1:{};
  markers1 = {
    0: {
      "image_url": "../../assets/img-temp/400x270/img1.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget1",
      "coords": {
        "lat": "149",
        "long": "168"
      }
    },
    1: {
      "image_url": "../../assets/img-temp/400x270/img2.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget2",
      "coords": {
        "lat": "179",
        "long": "205"
      }
    },
    2: {
      "image_url": "../../assets/img-temp/400x270/img3.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget3",
      "coords": {
        "lat": "241",
        "long": "373"
      }
    },
    3: {
      "image_url": "../../assets/img-temp/400x270/img4.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget4",
      "coords": {
        "lat": "543",
        "long": "244"
      }
    },
    4: {
      "image_url": "../../assets/img-temp/400x270/img5.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget5",
      "coords": {
        "lat": "601",
        "long": "268"
      }
    },
    5: {
      "image_url": "../../assets/img-temp/400x270/img6.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget6",
      "coords": {
        "lat": "636",
        "long": "260"
      }
    },
    6: {
      "image_url": "../../assets/img-temp/400x270/img7.jpg",
      "date": "117:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget7",
      "coords": {
        "lat": "614",
        "long": "118"
      }
    },
    7: {
      "image_url": "../../assets/img-temp/400x270/img8.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget8",
      "coords": {
        "lat": "701",
        "long": "70.125"
      }
    },
    8: {
      "image_url": "../../assets/img-temp/400x270/img17.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget9",
      "coords": {
        "lat": "950",
        "long": "177"
      }
    },
    9: {
      "image_url": "../../assets/img-temp/400x270/img15.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget10",
      "coords": {
        "lat": "1079",
        "long": "463"
      }
    },
    10: {
      "image_url": "../../assets/img-temp/400x270/img7.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget 11",
      "coords": {
        "lat": "717",
        "long": "455"
      }
    },
    11: {
      "image_url": "../../assets/img-temp/400x270/img5.jpg",
      "date": "17:48, April 27, 2015",
      "location": "South Africa",
      "title": "Proin egestas purus eget 12",
      "coords": {
        "lat": "625",
        "long": "510"
      }
    },
    canvas: {
      src: '../../assets/img/maps/map.svg',
      width: 1170,
      height: 594
    }
  };
  html=` <div
  class="text-center text-uppercase u-ns-bg-v1-bottom g-absolute-centered--x g-bg-black g-width-170 g-mb-40">
  <img class="img-fluid" src={{[image_url]}} alt={{[title]}}>

  <div class="g-pa-25">
      <h5 class="g-color-primary g-font-weight-600 g-font-size-10 g-mb-9">{[date]}</h5>
      <h4 class="g-color-gray-light-v1 g-font-weight-600er g-font-size-9 g-mb-10">
          <i class="fa fa-map-marker g-valign-middle g-color-primary g-font-size-default"></i>
          <span class="g-valign-middle">{[location]}</span>
      </h4>
      <h2 class="g-color-white g-font-weight-600er g-font-size-14 mb-0">{[title]}</h2>
  </div>
</div>`
  constructor() { }

  ngOnInit(): void {
    /*this.location=[
      ['Coogee Beach', -33.923036, 151.259052, 5]
    ];
    console.log(this.location)*/
     $.HSCore.components.HSGMap.init('.js-g-map');
    /*console.log('marker1', this.markers1)

    console.log('marker1-2', this.markers1)
    $(window).on('load', function () {
      $.HSCore.components.HSPinMap.init('.js-pin-map', {
        data: {
          "map-pin": this.markers1
        }
      });
    });*/
  }


}
