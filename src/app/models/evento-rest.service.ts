import { Inject, Injectable } from '@angular/core';
import { Evento } from './evento';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RestDataSource, REST_URL } from './rest.datasource';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class EventoRestService extends RestDataSource {

  private list: Evento[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(http: HttpClient, @Inject(REST_URL) private url: string, public router: Router) {
    super(http, router);
    this.url = url + "evento/";    
  }

   init() {
    let v=this.loadData()
      //.pipe(takeUntil(this.unsubscribe$))
      v.subscribe(result => {
        this.list = result;
        //console.log("getAllEventos", this.list)
      });  
    return v;
  }

  loadData() {
    return super.sendRequest<Evento[]>("GET", this.url)
  }

  async createEvento(evento: Evento) {
    let hayRrror = false;
    console.log('createEvento ');
    let data = new Observable((observer) => {
      super.sendRequest<Evento>("POST", this.url, evento)
        .subscribe(respuesta => {
          console.log('subscribe services data ', respuesta)

          console.log('evento recibido', respuesta)
          if ((respuesta as any)._id) {
            evento.eventoId = (respuesta as any)._id;
          }
          evento.createdDate = respuesta.createdDate

          Object.assign(evento, respuesta)
          console.log('evento salvado', evento)
          this.list.unshift(evento)
          observer.next(evento);
        },
          error => {
            console.log('error', super.getServerErrorMessage(error));
            evento = null;
            hayRrror = true;
            observer.error(throwError(error))
          },
          () => {
            console.log('Solicitud completada')
            console.log('Resultado', hayRrror, evento)
            observer.next(evento);;
          }
        )
    })
    return data;
  }

  getAllEventos(): Evento[] {
    console.log("this.list", this.list.length)
    return this.list;
  }

  getEventosActivos(): Evento[]/*Observable<Evento[]>*/ {
    //return super.sendRequest<Evento[]>("GET", this.url);
    return this.list.filter((evento) => evento.destacado == true);
  }

  getEventobyId(id: string): Observable<Evento> {
    return super.sendRequest<Evento>("GET", `${this.url}id/${id}`);
  }

  deleteEvento(eventoId: string) {
    return this.sendRequest<Evento>("DELETE", `${this.url}${eventoId}`).toPromise().finally(() => {
      let index = this.list.findIndex(item => item.eventoId == eventoId);
      this.list.splice(index, 1);
    });
  }

  updateEvento(Id: string, evento: Evento) {
    console.log('evnto a enviar', evento);
    let data = new Observable((observer) => {
      this.sendRequest<Evento>("PATCH", `${this.url}${Id}`, evento)
        .subscribe((e) => {
          console.log('modificado')
          let index = this.list.findIndex(item => item.eventoId == Id);
          Object.assign(evento, e)
          this.list.splice(index, 1, evento);
        },
        error => {
          console.log('error', super.getServerErrorMessage(error));
          evento = null;
          observer.error(throwError(error))
        },
        () => {
          console.log('Solicitud completada')
          observer.next(evento);;
        }
      )
      })
      return data;
    }

  ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
}
