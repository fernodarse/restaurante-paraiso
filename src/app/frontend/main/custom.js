//JS Plugins Init.
// initialization of master slider

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

// initialization of google map
function initMap() {
  $.HSCore.components.HSGMap.init('.js-g-map');
}

$(document).on('ready', function () {
  // initialization of carousel
  $.HSCore.components.HSCarousel.init('.js-carousel');

  // initialization of header
  $.HSCore.components.HSHeader.init($('#js-header'));
  $.HSCore.helpers.HSHamburgers.init('.hamburger');

  // initialization of tabs
  $.HSCore.components.HSTabs.init('[role="tablist"]');

  // initialization of go to section
  $.HSCore.components.HSGoTo.init('.js-go-to');

  $('#ourFood [role="tablist"] .nav-link').on('click', function () {
    setTimeout(function () {
      $('#ourFoodTabs .js-carousel').slick('setPosition');
    }, 200);
  });
});

$(window).on('load', function () {
  // initialization of HSScrollNav
  $.HSCore.components.HSScrollNav.init($('#js-scroll-nav'), {
    duration: 700
  });

  // initialization of cubeportfolio
  $.HSCore.components.HSCubeportfolio.init('.cbp');
});

$(window).on('resize', function () {
  setTimeout(function () {
    $.HSCore.components.HSTabs.init('[role="tablist"]');
  }, 200);
});