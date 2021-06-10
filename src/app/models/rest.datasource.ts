import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable,throwError  } from "rxjs";
import { catchError, delay  } from "rxjs/operators";

export const REST_URL = new InjectionToken("rest_url");

//@Injectable()
export class RestDataSource {

    constructor(protected http: HttpClient) { }

    protected sendRequest<T>(verb: string, url: string, body?: T): Observable<T> {
        let myHeaders = new HttpHeaders();
        myHeaders = myHeaders.set("Access-Key", "<secret>");
        myHeaders = myHeaders.set("Application-Names", ["exampleApp", "proAngular"]);
        return this.http.request<T>(verb, url, {
            body: body,
            headers: myHeaders
        })
        //.pipe(delay(1000))//demorar la solicitud
        .pipe(catchError((error: Response) =>
        throwError(`Network Error: ${error.statusText} (${error.status})`)));
    }

}