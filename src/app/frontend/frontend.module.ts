import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FrontendComponent } from './main/frontend.component';
import { AboutComponent } from './about/about.component';
import { HeaderComponent } from '../component/header/header.component';
import { MenuComponent } from './menu/menu.component';
import { OurFoodComponent } from './our-food/our-food.component';
import { ServicesComponent } from './services/services.component';
import { GalleryComponent } from './gallery/gallery.component';
import { OurTeamComponent } from './our-team/our-team.component';
import { BookingComponent } from './booking/booking.component';
import { ContactComponent } from './contact/contact.component';
import { MainSliderComponent } from './main-slider/main-slider.component';
import { SpecialComponent } from './special/special.component'


let routes = RouterModule.forChild([
  { path: "", component: FrontendComponent, pathMatch: "full" },
  { path: '**', component: FrontendComponent }
]);

@NgModule({
  imports: [
    CommonModule, routes
  ],
  declarations: [MainSliderComponent, HeaderComponent, FrontendComponent, AboutComponent, MenuComponent, OurFoodComponent, ServicesComponent, GalleryComponent, OurTeamComponent, BookingComponent, ContactComponent, SpecialComponent],
})
export class FrontendModule { }
