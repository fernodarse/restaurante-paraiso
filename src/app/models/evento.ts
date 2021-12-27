export class Evento {
    eventoId: string;
    name: string;
    descripcion: string;
    destacado: boolean;
    photoURL: string;
    createdDate: any;
    datosImg: {url: string, name:string}
    
    constructor() {
        this.descripcion = '';
        this.datosImg= {url: '',name:''};
        this.photoURL = '';
    }

    hayImagen() {
        return this.photoURL != '' || this.datosImg.url != '';
      }
    
     imagenPrincipal():string {
        return this.photoURL != '' ? this.photoURL : this.datosImg.url ;
      }
    
      tituloImagen() {
        return this.photoURL != '' ? '' : this.datosImg.name ;
      }
}