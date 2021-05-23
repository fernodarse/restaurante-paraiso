import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppUser } from 'src/app/models/appuser';
import { Comments,CommentBy } from 'src/app/models/comment';
import { CommentService } from 'src/app/models/comment.service';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { MenuService } from 'src/app/models/menu.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  providers: [DatePipe]
})
export class CommentsComponent implements OnInit {

  @Input()
  menuId;

  appUser: AppUser;
  public comments = new Comments();
  
  commentList: Comments[] = [];
  private unsubscribe$ = new Subject<void>();


  constructor(private datePipe: DatePipe,
    private commentService: CommentService,
    private authService: AuthService,
    private snackBarService: SnackbarService,
    private menuServices: MenuService) { }
  

ngOnInit() {
  this.authService.appUser$.subscribe(appUser => { 
    this.appUser = appUser;
    this.comments.photoURL=this.appUser.photoURL;
  });
  this.getAllComments();
}

onCommentPost(commentForm) {
  this.comments.commentDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm:ss');
  this.comments.menuId = this.menuId;  
  this.commentService.saveComment(this.comments).then(
    commentForm.resetForm()
  );
}

getAllComments() {
  this.commentService.getAllCommentsForMenu(this.menuId)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      this.commentList = result;
      console.log('comentarios del menu',result);
    });
}

deleteComment(commentId) {
  if (confirm('Do you want to delete this comment!!!')) {
    this.commentService.deleteSingleComment(commentId).then(
      () => {
        this.snackBarService.showSnackBar('Comment Deleted successfully');
      });
  }
}

login() {
  this.authService.login();
}
ngOnDestroy() {
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
}

}
