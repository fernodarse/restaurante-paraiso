import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, delay } from "rxjs/operators";
import { Router } from "@angular/router";

export const REST_URL = new InjectionToken("rest_url");

//@Injectable()
export class RestDataSource {

    constructor(protected http: HttpClient, public router: Router) { }

    protected sendRequest<T>(verb: string, url: string, body?: T): Observable<T> {
        let myHeaders = new HttpHeaders();
        myHeaders = myHeaders.set("Access-Key", "<secret>");
        myHeaders = myHeaders.set("Application-Names", ["exampleApp", "proAngular"]);

        return this.http.request<T>(verb, url, {
            body: body,
            headers: myHeaders
        })
            //.pipe(delay(1000))//demorar la solicitud
            .pipe(
                catchError((error: Response) =>
                    //throwError(`Network Error: ${error.statusText} (${error.status})`)
                    throwError(this.getServerErrorMessage(error))
                ));
    }

    private getServerErrorMessage(error: Response): string {
        switch (error.status) {
            case 404: {
                return `Not Found: ${error.statusText}`;
            }
            case 401: {//403
                return `Access Denied: ${error.statusText}`;
            }
            case 500: {
                return `Internal Server Error: ${error.statusText}`;
            }
            default: {
                return `Unknown Server Error: ${error.statusText}`;
            }

        }
    }

    public checkErrorAccses(error: string){
        if(error.includes('Access Denied')){
            console.error('Access Denied',error)
            this.router.navigateByUrl('/login');
          }
          console.error('error en services',error)
    }

}