import { Directive, ElementRef, HostBinding, HostListener, OnInit } from '@angular/core';
@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {

    constructor(private dropDownButton: ElementRef) { }

    ngOnInit(): void {
        this.dropDownMenu = this.dropDownButton.nativeElement.querySelector('.dropdown-menu1');
        // this.dropDownLink = this.dropDownButton.nativeElement.querySelector('.u-link-v5');
    }
    dropDownMenu: HTMLElement;
    //dropDownLink: HTMLElement;


    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        if (this.dropDownButton.nativeElement.contains(event.target)) {
            // this.dropDownMenu.classList.toggle('show');

            // this.dropDownLink.classList.add('active') 
            this.dropDownMenu.classList.remove('u-dropdown--hidden');
            this.dropDownMenu.classList.add('fadeIn');

        } else {
            // this.dropDownMenu.classList.remove('show');

            // this.dropDownLink.classList.remove('active') 
            this.dropDownMenu.classList.remove('fadeIn');
            this.dropDownMenu.classList.add('u-dropdown--hidden');

        }
    }

    mostrar() {

    }

    ocultar() {

    }


}