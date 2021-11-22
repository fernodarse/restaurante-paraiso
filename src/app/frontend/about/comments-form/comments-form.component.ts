import { Component, Inject, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppUser } from 'src/app/models/appuser';
import { Comments, CommentBy } from 'src/app/models/comment';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommentRestService } from 'src/app/models/comment-rest.service';
import { MenuRestService } from 'src/app/models/menu-rest.service';

@Component({
  selector: 'app-comments-form',
  templateUrl: './comments-form.component.html',
  styleUrls: ['./comments-form.component.css'],
  providers: [DatePipe]
})
export class CommentsFormComponent implements OnInit {

  @Input()
  menuId;

  appUser: AppUser;
  public comments = new Comments();

  commentList: Comments[] = [];
  private unsubscribe$ = new Subject<void>();
  submit: boolean = false;

  constructor(private datePipe: DatePipe,
    private commentService: CommentRestService,
    @Inject("autenticar") private authService: AuthService,
    private snackBarService: SnackbarService,
    private menuServices: MenuRestService) { }


  ngOnInit() {
    this.authService.appUser$.subscribe(appUser => {
      this.appUser = appUser;
    });
    //this.getAllComments();
  }

  async onCommentPost(commentForm) {
    //this.comments.menuId = this.menuId;  
    if (commentForm.valid) {
      this.comments.commentDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm:ss');
      this.comments.photoURL = this.appUser.photoURL;
      this.submit = true;
      try {
        (await this.commentService.saveComment(this.comments)).subscribe(
          (resp) => {
            console.log('respuesta del booking', resp)
            this.submit = false;
            this.snackBarService.openSnackBar((resp as any).message);
            this.resetForm(commentForm)
          });
      } catch (Error) {
        console.log('error', Error)
        this.submit = false;
        this.snackBarService.openSnackBar('Se ha producido un error, intentelo más tarde');
      }
    }
  }

  getAllComments() {
    this.commentService.getAllCommentsForMenu(this.menuId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        this.commentList = result;
        console.log('comentarios del menu', result);
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

  signInWithGoogle(): void {
    this.authService.signInWithGoogle()
  }

  signInWithFB(): void {
    this.authService.signInWithFB()
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  resetForm(ngForm) {
    this.comments = new Comments();
    ngForm.resetForm();
  }

  isLoging(){
    return this.appUser != null
  }

}
