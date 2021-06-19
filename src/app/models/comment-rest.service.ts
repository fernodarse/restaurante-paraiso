import { Inject, Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, of,combineLatest, Subject } from 'rxjs';
import { flatMap, map, switchMap, takeUntil } from 'rxjs/operators';
import { CommentBy, Comments } from '../models/comment';
//import { uniq, flatten } from 'lodash'
import { Menu } from './menu';
import { AppUser } from './appuser';
import { RestDataSource, REST_URL } from './rest.datasource';
import { HttpClient } from '@angular/common/http';
import { Evento } from './evento';

@Injectable({
  providedIn: 'root'
})
export class CommentRestService extends RestDataSource{

  private list: Comments[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(http: HttpClient, @Inject(REST_URL) private url: string) {
    super(http);
    this.url = url + "coment/"; 
    super.sendRequest<Comments[]>("GET", this.url)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.list = result;
      console.log("getAllComments", this.list)
    });
  }

  saveComment(comment: Comments) {
   let data = super.sendRequest<Comments>("POST", this.url, comment)
    .subscribe(e => {
      if((e as any)._id) {
        comment.commentId=(e as any)._id;
      }
      comment.commentDate=e.commentDate  
      console.log('comentario recibido', e)
      Object.assign(comment,e)
      console.log('comentario salvado', comment)  
      this.list.unshift(comment)   
    })  

    return of(comment).toPromise() ;
  }

  updateComment(Id: string, comment: Comments) {
    /*const putData = JSON.parse(JSON.stringify(comment));
    return this.db.doc('comments/' + Id).update(putData);*/
    console.log('evnto a enviar', comment);
    let res=this.sendRequest<Comments>("PATCH", `${this.url}${Id}`, comment);
    res.subscribe((e)=>{
      console.log('modificado')
      let index= this.list.findIndex(item => item.commentId == Id);
      Object.assign(comment,e)
      this.list.splice(index,1,comment);
    })
    return     res.toPromise() 
  }

  
  getAllComments(){    
  return this.list;
  }

  getAllCommentsForMenu(menuId: string): Observable<Comments[]> {
    return super.sendRequest<Comments[]>("GET", `${this.url}coment/menu/${menuId}`);
  }

  getCommentbyId(id: string): Observable<Comments> {
    return super.sendRequest<Comments>("GET", `${this.url}id/${id}`);
  }

  deleteAllCommentForMenu(menuId: string) {
    /*const commentsToDelete = this.db.collection('comments', ref =>
      ref.where('menuId', '==', menuId)).snapshotChanges();
    commentsToDelete.forEach(
      commentList => {
        commentList.forEach(comment => {
          this.db.doc('comments/' + comment.payload.doc.id).delete();
        });
      }
    );*/
  }

  deleteSingleComment(commentId: string) {
    return this.sendRequest<Comments>("DELETE", `${this.url}${commentId}`).toPromise().finally(() => {
      let index= this.list.findIndex(item => item.commentId == commentId);
      this.list.splice(index,1); 
    });
  } 

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
