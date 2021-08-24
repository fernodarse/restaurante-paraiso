import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'table-opcion',
  templateUrl: './table-opcion.component.html',
  styleUrls: ['./table-opcion.component.css']
})
export class TableOpcionComponent implements OnInit,AfterViewInit {

  activo:boolean;
  @Input("id") id: String;
  invoker:String;
  dropdown:String;  

  @Input("accion") action: String;
  @Input("label") label: String;

  constructor(private elementRef: ElementRef) {
    

   }

  ngOnInit(): void {
    this.activo=false;
  }

  ngAfterViewInit(): void{
    this.invoker='dropDownInvoker'+this.id;
    this.dropdown='dropDown'+this.id;
  }

  @HostListener('document:click', ['$event']) clickout(event) {
    if (this.elementRef.nativeElement.contains(event.target)  && this.activo) {
      //console.log(event.target)   
     // console.log('entro')
      this.activo=true;
    }else{
      //console.log(event.target)
      this.activo=false;
    }
  }

  clicked(){
    this.activo=!this.activo;
    console.log('el id',this.id)
  }

  focusout(event: any) {
    /*console.log('evento',event.target)
    console.log(this);*/
    console.log('focusout');
    //this.activo=!this.activo;
  }

  mouseout(){
    console.log('mouseout');
  }

  mouseover(){
    console.log('mouseover');
  }

  focus(){
    console.log('focus')
  }
  accion(){
    console.log('accion')
  }

  getClasses(){
    return this.activo ?  'fadeIn'  : 'u-dropdown--hidden'
  }

}
