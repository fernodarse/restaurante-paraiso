import { Component, OnInit } from '@angular/core';
import { CommentService } from 'src/app/models/comment.service';

@Component({
  selector: 'app-coment',
  templateUrl: './coment.component.html',
  styleUrls: ['./coment.component.css']
})
export class ComentComponent implements OnInit {

  constructor(private commentServices: CommentService) { }

  ngOnInit(): void {
  }

  getCommentList() {
    let list=this.commentServices.getAllComments()
    list=list.concat(list)
    list=list.concat(list)
    list=list.concat(list)
    list=list.concat(list)
    list=list.concat(list)
    return list; 
  }

}
