import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, of,combineLatest, Subject } from 'rxjs';
import { flatMap, map, switchMap } from 'rxjs/operators';
import { CommentBy, Comments } from '../models/comment';
//import { uniq, flatten } from 'lodash'
import { Menu } from './menu';
import { AppUser } from './appuser';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private list: Comments[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private db: AngularFirestore) { 
    const comments = this.db.collection<Comments>('comments',
    ref => ref.orderBy('commentDate','desc'))
        .snapshotChanges().pipe(
        map(actions => {
          return actions.map(
            c => ({
              commentId: c.payload.doc.id,
              ...c.payload.doc.data()
            }));
        })).subscribe(result => {
          this.list=result;
          console.log("getAllComments", this.list)
        });;
  }

  saveComment(comment: Comments) {
    
    comment.menu="menus/"+comment.menuId;
    //comment.commentedBy.photoURL=user.photoURL;
    const commentData = JSON.parse(JSON.stringify(comment));
    return this.db.collection('comments').add(commentData).then(ref => {    
      console.log("Saved object: ", ref)
   });
  }

  updateComment(Id: string, comment: Comments) {
    const putData = JSON.parse(JSON.stringify(comment));
    return this.db.doc('comments/' + Id).update(putData);
  }

  
  getAllComments(){    
  return this.list;
  }

  getActiveComments(){    
    return this.list;
  }

  getAllCommentsForMenu(menuId: string): Observable<Comments[]> {
    const comments = this.db.collection<Comments>('comments',
      ref => ref.where('menuId', '==', menuId)
            .where('activo', '==', true)
            .orderBy('commentDate','desc')).snapshotChanges().pipe(
          map(actions => {
            return actions.map(
              c => ({
                commentId: c.payload.doc.id,
                ...c.payload.doc.data()
              }));
          }));
    return comments;
  }

  getCommentbyId(id: string): Observable<Comments> {
    const objectDetails = this.db.doc<Comments>('comments/' + id).valueChanges();  
    return objectDetails;
  }

  deleteAllCommentForMenu(menuId: string) {
    const commentsToDelete = this.db.collection('comments', ref =>
      ref.where('menuId', '==', menuId)).snapshotChanges();
    commentsToDelete.forEach(
      commentList => {
        commentList.forEach(comment => {
          this.db.doc('comments/' + comment.payload.doc.id).delete();
        });
      }
    );
  }

  deleteSingleComment(commentId: string) {
    return this.db.doc('comments/' + commentId).delete();
  }

  //metodos de prueba
  getAllCommentsMenu() {
    let menu;
    let result = this.db.collection<Comments>('comments')
      .valueChanges()
      .pipe(
        switchMap(commentsList => {
          const menuIds = []//uniq(commentsList.map(c => c.menuId));
          return combineLatest([
                          of(commentsList),
               combineLatest([
              menuIds.map(menuListId => 
               // let busMenus = this.db.doc<Menu>('menus/' + menuListId).valueChanges(); 
                this.db
                   .collection<Menu>('menus', ref => 
                       ref.where('menuId', '==', menuListId )
                    )
                    .valueChanges()
                    .pipe(map(menus => menus[0]))                  
              )
            ])
           ])

        }),
        map(([commentsList, menus]) => {
          //console.log('menus 1', menus)
          return commentsList.map(comment => {
            //console.log('menus 2', menus)
            return {
              ...comment,
             /* menu: menus.find(m => {
                  (<Menu>m).menuId == comment.menuId
             })*/
            }
          })
          

        })
      )
      //result.subscribe(console.log)
    //console.log('result', )
    return result;
  }

  getMM(){

    console.log('cargando')
    const temp = []
    let com = this.db.collection<Comments>('comments').snapshotChanges().pipe(
      map(auctions=>{
        //we save all auctions in temp and return just the bidderId 
    
        return auctions.map(auction=>{
          const data={} = auction.payload.doc.data() as Comments;
          const id = auction.payload.doc.id;
          temp.push({id, ...data})
          return data.menuId
        })
    
    
      }),
      switchMap(bidderIds=>{
        // here you'll have all bidderIds and you need to return the array to query 
        // them to firebase
        console.log('bidderIds',bidderIds)
        return combineLatest(bidderIds.map(bidderId=>  this.db.doc(`menus/${bidderId}`) ))
      }),
      map(bidders=>{
        console.log('bidders', bidders)
        return bidders;
        // here you'll get all bisders you'll have to set the bidder on each temp obj 
        // you saved previously
      })
    )

  }

  saveCommentConRef(comment: Comments,user:CommentBy) {
    if(comment.menuId){
      comment.menu="menus/"+comment.menuId;
     /* //let tempC=new Comments(this.db.doc("menus/"+comment.menuId).ref);
      console.log('id',comment.menuId);
      this.db.doc(`menus/${comment.menuId}`).valueChanges().subscribe(console.log)   
      menuF=this.db.doc(`menus/${comment.menuId}`)   
      tempC = {
        commentId: comment.commentId,
        menuId: comment.menuId,
        menu: '',//this.db.doc(`menus/${comment.menuId}`).ref ,
        email: comment.email,
        commentedBy: comment.commentedBy,
        content: comment.content,
        commentDate: comment.commentDate, 
    } as Comments
    Object.assign(comment,tempC);
      console.log('comentario completo', tempC);
      */
    }

    //comment.menu = comment.menuId ? this.db.collection("menus/"+comment.menuId).ref : null;
    const commentData = JSON.parse(JSON.stringify(comment));
    return this.db.collection('comments').add(commentData).then(ref => {      
      console.log("Saved object: ", ref)
   });
  }
}
