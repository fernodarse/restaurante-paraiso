import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { RestDataSource, REST_URL } from './rest.datasource';

@Injectable({
  providedIn: 'root'
})
export class FileRestService /*extends RestDataSource*/ {
  

  constructor( private http: HttpClient, @Inject(REST_URL) private url: string) {
      this.url = url + "file/";
     }

  private deleteFileStorage(name: string): void {
    /*const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();*/
  }

  pushFileToStorage(fileUpload: File, datos: {url: string, name:string}): Observable<number | undefined>{
    let porcentage= new Observable<number>((observer) => {
    this.sendRequest(this.url,fileUpload).subscribe(res => {
      console.log('respuesta a subir fichero',res);
      if(res.body && res.body.filename){
        datos.name=res.body.filename;
        datos.url=this.url+res.body.filename;
      } 
      
      switch (res.type) {
        case HttpEventType.Sent:
          observer.next(10);
          break;
        case HttpEventType.ResponseHeader:
          observer.next(20);
          break;
        case HttpEventType.DownloadProgress:
          const kbLoaded = Math.round(res.loaded / res.total)*100;
          observer.next(kbLoaded);
          break;
      }
    })
    return {
      unsubscribe() { }
    };
  })

    return porcentage
  }

  sendRequest( url: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true, 
    });
    
    return  this.http.request(req)
    .pipe(catchError((error: Response) =>
    throwError(`Network Error: ${error.statusText} (${error.status})`)));
}

}
