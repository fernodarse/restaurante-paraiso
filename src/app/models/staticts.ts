
export interface CategoriaMenu {
    id: string
    nombre: string;
}

export class ListCategoriaMenu {

    categoriaMenu: CategoriaMenu[] = [
        { id: '0', nombre: "Cockteles" },
        { id: '1', nombre: "Ensaladas" },
        { id: '2', nombre: "Carnes" },
        { id: '3', nombre: "Postres" },
    ];

    categoriaXId(id) {
        let v =this.categoriaMenu.find(cat => cat.id==id );
       return v.nombre;
    }

}

export enum Role {
    User = 'user',
    Admin = 'admin',
}

