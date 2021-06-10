import { Injectable, OnInit } from '@angular/core';
import { Menu } from '../models/menu';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

@Injectable(/*{
  providedIn: 'root'
}*/)

export class MenuService {

  private menuList: Menu[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private db: AngularFirestore) {
    this.db.collection<Menu>('menus', ref =>
      ref.orderBy('createdDate', 'desc'))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(
            c => ({
              menuId: c.payload.doc.id,
              ...c.payload.doc.data()
            }));
        })).pipe(takeUntil(this.unsubscribe$))
        .subscribe(result => {
          this.menuList = result;
          console.log("getAllMenus", this.menuList)
        });
   }

  createMenu(menu: Menu) {
    const menuData = JSON.parse(JSON.stringify(menu));
    console.log("createMenu ", menuData);
    return this.db.collection('menus').add(menuData);
  }

  getAllMenus(): Menu[] {
    return this.menuList 
  }

  getMenubyId(id: string): Observable<Menu> {
    console.log("id ", id);  
    const menuDetails = this.db.doc<Menu>('menus/' + id).valueChanges(); 
    console.log("menuDetails ", menuDetails);   
    return menuDetails;
  }

  deleteMenu(menuId: string) {
    return this.db.doc('menus/' + menuId).delete();
  }

  updateMenu(menuId: string, menu: Menu) {
    const putData = JSON.parse(JSON.stringify(menu));
    return this.db.doc('menus/' + menuId).update(putData);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
