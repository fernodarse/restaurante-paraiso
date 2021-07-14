import { Injectable } from '@angular/core';
import { Evento } from '../models/evento';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventoService {

  private list: Evento[] = [];
  private unsubscribe$ = new Subject<void>();
  
  constructor(private db: AngularFirestore) {
    this.loadData().subscribe(result => {
        this.list=result;
        console.log("getAllEvento", this.list)
      });
   }

   loadData(){
     return this.db.collection<Evento>('eventos', ref =>
     ref.orderBy('createdDate', 'desc'))
     .snapshotChanges().pipe(
       map(actions => {
         return actions.map(
           c => ({
               eventoId: c.payload.doc.id,
             ...c.payload.doc.data()
           }));
       }))
   }

  createEvento(evento: Evento) {
    const eventoData = JSON.parse(JSON.stringify(evento));
    console.log("createEvento ", eventoData);
    return this.db.collection('eventos').add(eventoData);
  }

  getAllEventos(): Evento[] {    
    return this.list;
  }

  getEventosActivos(): Evento[] /*Observable<Evento[]>*/ { 
    /*return this.db.collection<Evento>('eventos', ref =>
    ref.orderBy('createdDate', 'desc'))
    .snapshotChanges().pipe(
      map(actions => {
        return actions.map(
          c => ({
              eventoId: c.payload.doc.id,
            ...c.payload.doc.data()
          }));
      }))*/
      return this.list.filter((evento)=>evento.destacado==true);
  }

  getEventobyId(id: string): Observable<Evento> {
    console.log("id ", id);  
    const eventoDetails = this.db.doc<Evento>('eventos/' + id).valueChanges(); 
    console.log("eventoDetails ", eventoDetails);   
    return eventoDetails;
  }

  deleteEvento(eventoId: string) {
    return this.db.doc('eventos/' + eventoId).delete();
  }

  updateEvento(Id: string, evento: Evento) {
    const putData = JSON.parse(JSON.stringify(evento));
    return this.db.doc('eventos/' + Id).update(putData);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
