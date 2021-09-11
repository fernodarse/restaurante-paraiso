import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let token: string = localStorage.getItem('token');
    
    /*let headerOut=req.headers;
    let accesKey=headerOut.get("Access-Key")
    
    console.log('Access-Key interceptor', accesKey);
    if(accesKey=='dropbox'){
      console.log('Access-Key interceptor', accesKey);
      token=localStorage.getItem('token-dropbox');
      console.log('token', token);
      localStorage.removeItem('token-dropbox')
    }*/

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${ token }`
        }
      });
    }

    return next.handle(request);
  }

}