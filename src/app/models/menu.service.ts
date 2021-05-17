import { Injectable } from '@angular/core';
import { Menu } from '../models/menu';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MenuService {

  constructor(private db: AngularFirestore) { }

  createMenu(menu: Menu) {
    const menuData = JSON.parse(JSON.stringify(menu));
    console.log("createMenu ", menuData);
    return this.db.collection('menus').add(menuData);
  }

  getAllMenus(): Observable<Menu[]> {
    const menus = this.db.collection<Menu>('menus', ref =>
      ref.orderBy('createdDate', 'desc'))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(
            c => ({
              menuId: c.payload.doc.id,
              ...c.payload.doc.data()
            }));
        }));
    return menus;
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
}
