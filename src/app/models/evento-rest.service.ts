import { Inject, Injectable } from '@angular/core';
import { Evento } from './evento';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestDataSource, REST_URL } from './rest.datasource';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class EventoRestService extends RestDataSource {

  private list: Evento[] = [];
  private unsubscribe$ = new Subject<void>();
  
  constructor(http: HttpClient, @Inject(REST_URL) private url: string,public router: Router) {
    super(http,router);
    this.url = url + "evento/";
    this.loadData()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.list = result;
      //console.log("getAllEventos", this.list)
    });
   }

   loadData(){
     return super.sendRequest<Evento[]>("GET", this.url)
   }

  createEvento(evento: Evento) {
    let data = super.sendRequest<Evento>("POST", this.url, evento)
    .subscribe(e => {
      if((e as any)._id) {
        evento.eventoId=(e as any)._id;
      }
      evento.createdDate=e.createdDate  
      console.log('evento recibido', e)
      Object.assign(evento,e)
      console.log('evento salvado', evento)  
      this.list.unshift(evento)   
    })  

    return of(evento).toPromise() ;
  }

  getAllEventos(): Evento[] {    
    return this.list;
  }

  getEventosActivos(): Evento[]/*Observable<Evento[]>*/ {    
    //return super.sendRequest<Evento[]>("GET", this.url);
    return this.list.filter((evento)=>evento.destacado==true);
  }

  getEventobyId(id: string): Observable<Evento> {
    return super.sendRequest<Evento>("GET", `${this.url}id/${id}`);
  }

  deleteEvento(eventoId: string) {
    return this.sendRequest<Evento>("DELETE", `${this.url}${eventoId}`).toPromise().finally(() => {
      let index= this.list.findIndex(item => item.eventoId == eventoId);
      this.list.splice(index,1); 
    });
  }

  updateEvento(Id: string, evento: Evento) {
    console.log('evnto a enviar', evento);
    let res=this.sendRequest<Evento>("PATCH", `${this.url}${Id}`, evento);
    res.subscribe((e)=>{
      console.log('modificado')
      let index= this.list.findIndex(item => item.eventoId == Id);
      Object.assign(evento,e)
      this.list.splice(index,1,evento);
    })
    return     res.toPromise() 
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
