import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Comments } from 'src/app/models/comment';

@Component({
  selector: 'card-comment',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  //430 pro-angular
  @Input("comment")
  comment: Comments;  

  @Output("eliminar")
  eliminar = new EventEmitter<string>();

  @Output("estado")
  estado = new EventEmitter<Comments>();

  showContent:boolean;

  constructor() { 
    this.showContent=false
  }

  deleteComment(){
    this.eliminar.emit(this.comment.commentId);
  }

  cambiarEstado(){
    this.estado.emit(this.comment);
  }

  getClasses(): string {
    return  (this.comment.activo ? "btn-danger" : "btn-warning");
  }

  getClassesActivo(){
    return  (this.comment.activo ? "hs-admin-thumb-down" : "hs-admin-thumb-up");
  }

  setShowContent(){
    this.showContent= !this.showContent;
  }
  ngOnInit(): void {
  }

}
