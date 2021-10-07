import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tiempoatras'
})

export class TiempoAtrasPipe implements PipeTransform {

    transform(value: string): string {
        if (typeof value === "undefined") return value;
        //if (value.length <= length) return value;

        const today = new Date();
        const endDate = new Date(value);
        const days = Math.floor((today.valueOf() - endDate.valueOf()) / (1000 * 60 * 60 * 24))//parseInt((endDate - today) / (1000 * 60 * 60 * 24));
        const hours = Math.floor(Math.abs(today.valueOf() - endDate.valueOf()) / (1000 * 60 * 60) % 24)//parseInt(Math.abs(endDate - today) / (1000 * 60 * 60) % 24);
        const minutes = Math.floor(Math.abs(today.getTime() - endDate.getTime()) / (1000 * 60) % 60) //parseInt(Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60) % 60);
        const seconds = Math.floor(Math.abs(today.getTime() - endDate.getTime()) / (1000) % 60)//parseInt(Math.abs(endDate.getTime() - today.getTime()) / (1000) % 60);

        /*console.log('days', days)
        console.log('hours', hours)
        console.log('minutes', minutes)
        console.log('seconds', seconds)*/

        if (days > 0) {
            return days + " días";
        } else if (hours > 0) {
            return hours + " horas";
        } else if (minutes > 0) {
            return minutes + " minutos";
        }
        return seconds + " segundos";
    }
}