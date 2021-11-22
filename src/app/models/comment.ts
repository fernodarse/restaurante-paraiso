
export class Comments {
    commentId: string;
    menuId: string;
    menu: string//firebase.default.firestore.DocumentReference;
    
    email: string;
    commentedBy: string;
    photoURL: string;
   
    content: string;
    commentDate: any;
    activo:boolean;
    
    constructor(){
        //this.commentedBy=new CommentBy();
        this.activo=true;
    }
}

export class CommentBy {
    name: string;
    email: string;
    photoURL: string;
}

