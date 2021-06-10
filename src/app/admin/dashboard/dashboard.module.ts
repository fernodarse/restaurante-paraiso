import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { TableMenuComponent } from '../menu/table/table-menu.component'
import { BookingComponent } from './booking/booking.component';
import { UsersComponent } from './users/users.component';

export const routes = [
    { path: '', component: TableMenuComponent },
    { path: 'menu', component: TableMenuComponent, pathMatch: "full" },
    { path: 'booking', component: BookingComponent, pathMatch: "full" },
    { path: 'users', component: UsersComponent, pathMatch: "full" }
];


@NgModule({
    declarations: [
        DashboardComponent,
        BookingComponent,
        UsersComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class DashboardModule {
    constructor() {
    }
}

