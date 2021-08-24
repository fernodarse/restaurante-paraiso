import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatTabsModule} from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatSortModule } from '@angular/material/sort';

import { NgxParallaxModule } from '@yoozly/ngx-parallax';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        MatMenuModule,
        MatSelectModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatPaginatorModule,
        NgxPaginationModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatSortModule,

        MatDatepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        MatNativeDateModule,
        MatTimepickerModule,
        NgxParallaxModule,
    ],
    exports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        MatMenuModule,
        MatSelectModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatCheckboxModule, 
        MatProgressBarModule,
        MatPaginatorModule,
        NgxPaginationModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatSortModule,
        
        MatDatepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        MatNativeDateModule,
        MatTimepickerModule,
        NgxParallaxModule,

    ]
})
export class NgMaterialModule { }