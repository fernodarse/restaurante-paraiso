import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RestDataSource } from './rest.datasource';

@Injectable({
  providedIn: 'root'
})
export class FileDropboxService {

  token: string = 'cuYyaRwA68kAAAAAAAAAAZXKrtCvSelyvmgGGXn_Qe2J8aoC6CmCSIYQ2z49v2T6'

  constructor(private http: HttpClient) { }

  public upload(file: File): Observable<any> {

    localStorage.setItem('token-dropbox', this.token)
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Access-Key", "dropbox");
    myHeaders = myHeaders.set("Content-Type", "application/octet-stream");
    myHeaders = myHeaders.set("authorization", `Bearer ${this.token}`);
    myHeaders = myHeaders.set("Dropbox-API-Arg",
      // "{\"path\": \"/"+FILE_NAME+"\",\"mode\": \"add\",\"autorename\": true,\"mute\": false,\"strict_conflict\": false}"
      JSON.stringify({
        path: '/' + file.name,
        mode: 'add',
        autorename: true,
        mute: false,
        //strict_conflict: false
      })
    );

    const formData = new FormData();
    formData.append('image', file);

    const req = new HttpRequest('POST', "https://content.dropboxapi.com/2/files/upload", formData, {
      headers: myHeaders,
      reportProgress: true,
    });
    return this.http.request(req)
      .pipe(catchError(
        (error: Response) => throwError(`Network Error: ${error.statusText} (${error.status})`)
      ));

    /*return this.http.request<any>("GET", ,formData, {
            body: body,
            headers: myHeaders
        })
            //.pipe(delay(1000))//demorar la solicitud
            .pipe(
                catchError((error: Response) =>
                    //throwError(`Network Error: ${error.statusText} (${error.status})`)
                    throwError(this.getServerErrorMessage(error))
                ));*/
  }

  public uploadXmlRequest(file: File): Observable<any> {
    var xhr = new XMLHttpRequest();
    let porcentage = new Observable<any>((observer) => {

      xhr.upload.onprogress = function (evt) {
        var percentComplete = (100 * evt.loaded) / evt.total;
        // Upload in progress. Do something here with the percent complete.
        //console.log('percentComplete f', percentComplete)
        observer.next({ progres: percentComplete });
      };

      xhr.onload = function () {
        if (xhr.status === 200) {
          var fileInfo = JSON.parse(xhr.response);
          // Upload succeeded. Do something here with the file info.
          if (fileInfo.id) {
            console.log('id', fileInfo.id)
            observer.next({ id: fileInfo.id, name: fileInfo.name });
            observer.complete();
          }
          console.log('fileInfo', fileInfo)

        }
        else {
          var errorMessage = xhr.response || 'Unable to upload file';
          // Upload failed. Do something here with the error.
          console.log('errorMessage', errorMessage)
        }

        return {
          unsubscribe() { }
        };
      };

      xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload');
      xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
        path: '/' + file.name,
        mode: 'add',
        autorename: true,
        mute: false
      }));

      xhr.send(file);


    });

    return porcentage;
  }

  public listSharedLink(id: string): Observable<any> {
    localStorage.setItem('token-dropbox', this.token)

    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", "Bearer " + this.token);
    myHeaders = myHeaders.set("Content-Type", "application/json");
    return this.http.request('POST', "https://api.dropboxapi.com/2/sharing/list_shared_links", {
      body: JSON.stringify({ "path": id }), //"id:CEUwD7aQA2YAAAAAAAAALw"
      headers: myHeaders,

    })
      .pipe(catchError(
        (error: Response) => throwError(`Network Error: ${error.statusText} (${error.status})`)
      ));
  }

  pushFileToStorage(fileUpload: File, datos: { url: string, name: string }): Observable<number | undefined> {
    let porcentage = new Observable<number>((observer) => {

      this.uploadXmlRequest(fileUpload).subscribe(res => {
        //console.log('uploade res', res)
        if (res.progres) {
          observer.next(res.progres)
        }
        if (res.id) {

          this.createSharedLink(res.name).subscribe(
            res3 => {
              console.log('res3', res3)
              if (res3.url) {
                let url = res3.url as string
                url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')

                datos.url = url
                datos.name = res.name;
                console.log('datos', datos)
                observer.complete();
              }
            },
            (error) => {
              //console.log('error createSharedLink', (error as string).includes("409"))
              //console.log('id a buscar', res.id)
              this.listSharedLink(res.id).subscribe(
                res2 => {
                  console.log('listSharedLink', res2)
                  console.log('links', res2.links)
                  if (res2.links && res2.links.length > 0) {
                    let url = res2.links[0].url as string
                    url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
  
                    datos.url = url
                    datos.name = res.name;
                    console.log('datos', datos)
                    observer.complete();
                  } 
                })
            }
          )
         
           /* this.listSharedLink(res.id).subscribe(
              res2 => {
                console.log('listSharedLink', res2)
                console.log('links', res2.links)
                if (res2.links && res2.links.length > 0) {
                  let url = res2.links[0].url as string
                  url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')

                  datos.url = url
                  datos.name = res.name;
                  console.log('datos', datos)
                  observer.complete();
                } else {
                  this.createSharedLink(res.name).subscribe(
                    res3 => {
                      console.log('res3', res3)
                      if (res3.url) {
                        let url = res3.url as string
                        url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')

                        datos.url = url
                        datos.name = res.name;
                        console.log('datos', datos)
                        observer.complete();
                      }
                    }
                  )
                }
              })*/
        }

      })
      return {
        unsubscribe() { }
      };
    })

    return porcentage
  }

  public createSharedLink(fileName: string): Observable<any> {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Authorization", "Bearer " + this.token);
    myHeaders = myHeaders.set("Content-Type", "application/json");

    return this.http.request('POST', "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
      headers: myHeaders,
      body: JSON.stringify({
        "path": "/" + fileName,
        "settings": {
          "audience": "public",
          "access": "viewer",
          "requested_visibility": "public",
          "allow_download": true
        }
      }),
    })
      .pipe(catchError(
        (error: Response) => throwError(`Network Error: ${error.statusText} (${error.status})`)
      ));
  }

}
