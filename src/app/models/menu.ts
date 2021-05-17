export class Menu {
    menuId: string;
    nombre: string;
    categoria: string;
    descripcion: string; 
    precio:number;   
    destacado:boolean;
    createdDate: any;
    datosImg: {url: string, name:string}
    
    constructor() {
        this.descripcion = '';
        this.datosImg= {url: '',name:''};
    }
}