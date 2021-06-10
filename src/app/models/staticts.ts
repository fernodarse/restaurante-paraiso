
export interface CategoriaMenu {
    id: string
    nombre: string;
}

export class ListCategoriaMenu {

    categoriaMenu: CategoriaMenu[] = [
        { id: '0', nombre: "Tragos" },
        { id: '1', nombre: "Sopas" },
        { id: '2', nombre: "Ensaladas" },
        { id: '3', nombre: "Buffet" },
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

