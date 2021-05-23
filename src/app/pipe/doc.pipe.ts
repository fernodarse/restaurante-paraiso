import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Pipe({
  name: 'doc'
})
export class DocPipe implements PipeTransform {

  constructor(private afs: AngularFirestore) { }
  
  transform(value: string/*firebase.default.firestore.DocumentReference*/): Observable<any> {
    console.log('valor del path',value)
    return this.afs.doc(value/*value.path*/).valueChanges();
  }

}