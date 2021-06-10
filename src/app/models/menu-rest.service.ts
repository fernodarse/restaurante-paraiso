import { Inject, Injectable } from '@angular/core';
import { Menu } from '../models/menu';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { RestDataSource, REST_URL } from './rest.datasource';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuRestService extends RestDataSource {

  private menuList: Menu[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(http: HttpClient, @Inject(REST_URL) private url: string) {
    super(http);
    this.url = url + "menu/";
    console.log('iniciado');
    super.sendRequest<Menu[]>("GET", this.url)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.menuList = result;
      console.log("getAllMenus", this.menuList)
    });
  }

  createMenu(menu: Menu): Promise<Menu> {
    
    let data = super.sendRequest<Menu>("POST", this.url, menu)
    .subscribe(m => {
      if((m as any)._id) {
      menu.menuId=(m as any)._id;
      }
      menu.createdDate=m.createdDate    
      this.menuList.unshift(menu)   
    })  

    return of(menu).toPromise() ;
  }

  getAllMenus(): Menu[] {
    return this.menuList;//super.sendRequest<Menu[]>("GET", this.url);
  }

  getMenubyId(id: string): Observable<Menu> {
    return super.sendRequest<Menu>("GET", `${this.url}id/${id}`);
  }

  deleteMenu(menuId: string) {
    return this.sendRequest<Menu>("DELETE", `${this.url}${menuId}`).toPromise().finally(() => {
      let index= this.menuList.findIndex(item => item.menuId == menuId);
      this.menuList.splice(index,1); 
    });
  }

  updateMenu(menuId: string, menu: Menu): Promise<Menu> {
   console.log('menu a enviar', menu);
    return this.sendRequest<Menu>("PATCH", `${this.url}${menuId}`, menu).toPromise<Menu>().finally(() => {
      
     let index= this.menuList.findIndex(item => item.menuId == menuId);
     this.menuList.splice(index,1,menu);      
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}