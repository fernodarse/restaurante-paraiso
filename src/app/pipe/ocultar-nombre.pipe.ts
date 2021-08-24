import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'ocultarnombre'
})
export class OcultarNombrePipe implements PipeTransform {
  
  transform(value: string): string {
    let result:string='';//='<span>'
    console.log('valor del nombre',value)
    if (typeof value === "undefined") return value;
    let nombres=value.split(' ')
    if(nombres.length > 1){
      for(let i=0;i<nombres.length;i++){
         if(i==0){
           let pNom=nombres[i];
           result+=`${pNom.slice(0,1)}<span class="g-hidden-md-up">.</span><span class="g-hidden-md-down">${pNom.slice(1,pNom.length)}&nbsp;</span>`;
         }else{
          result+=nombres[i]
         }
         
      }
     // result+='"'  //'</span>'
    }else{
      result=value;
    }

    return result;
  }

}