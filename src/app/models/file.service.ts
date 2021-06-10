import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { RestDataSource, REST_URL } from './rest.datasource';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  
  private basePath = '/uploadsMenu';

  constructor(private storage: AngularFireStorage) { }

  set path(path:string){
    this.basePath=path;
  }

  pushFileToStorage(fileUpload: File, datos: {url: string, name:string} ): Observable<number | undefined> {
    const filePath = `${this.basePath}/${fileUpload.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
         datos.url=downloadURL;
         datos.name=fileUpload.name;
         console.log('en progres',datos);
        });
      })
    ).subscribe(()=> {
      console.log('fichero subido',datos);
    });

    return uploadTask.percentageChanges();
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }


}
