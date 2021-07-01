import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/models/appuser';
import { MODES, SharedState, SHARED_STATE } from 'src/app/models/sharedState.model';
import { Role } from 'src/app/models/staticts';
import { UserRestService } from 'src/app/models/user-rest.service';
import { UserService } from 'src/app/models/user.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit {

  user: AppUser = new AppUser();
  editing: boolean = false;

  cambiarPas='';
  cambiarRepitPas='';

  constructor(private userService: UserService,
    @Inject(SHARED_STATE) public stateEvents: Observable<SharedState>,
    private snackBarService: SnackbarService,) {
    stateEvents.subscribe((update) => {
      this.user = new AppUser();
      console.log('recibiendo en form', update);
      if (update.id != undefined) {
        this.userService.getUserbyId(update.id).subscribe(result => {
          console.log('busqueda x id', result)
          Object.assign(this.user, result);
        });
      }
      this.editing = update.mode == MODES.EDIT;
    });

  }

  submitForm(form: NgForm) {
    console.log('submit form',form.valid);
    if (form.valid) {
      console.log('submit usuario', this.user);
      console.log('nuevo pas', this.cambiarPas,this.cambiarRepitPas);
      if (this.editing) {
        let msg='El usuario se modificó correctamente';
        if(this.cambiarPas!=''){
          this.user.password=this.cambiarPas;
          msg='La contraseña se guardó correctamente'
        }
        this.userService.updateUser(this.user.userId, this.user,this.cambiarPas!='').then(
          () => {
            this.snackBarService.openSnackBar(msg);
          }
        );
      } else {
        this.user.rol = Role.Admin
        this.userService.create(this.user).then(
          () => {
            this.snackBarService.openSnackBar('El usuario se creo satifactioramente');
          }
        );
      }
      //form.reset();
      //this.resetForm();
    }
  }
  resetForm(form: NgForm) {
    form.reset()
    this.user = new AppUser();
  }

  resetFormPassword() {
    this.user = new AppUser();
  }

  getValidationMessages(state: any, thingName?: string) {
    let thing: string = state.path || thingName;//tiene el mombre del campo
    let messages: string[] = [];
    if (state.errors) {
      for (let errorName in state.errors) {
        switch (errorName) {
          case "required":
            messages.push(`Se <strong> requiere </strong> el campo ${thing}`);
            break;
          case "pattern":
            messages.push(`El ${thing} tiene error de formato`);
            break;
          case "email":
            messages.push(`El ${thing} no es válido`);
            break;
          case "userNameNotAvailable":
            messages.push(`El nombre de usuario está en uso`);
            break;
          case "minlength":
            messages.push(`El ${thing}  requiere ${state.errors['minlength'].requiredLength} caracteres`);
            break;
          case "passwordMismatch":
            messages.push(`El password no coincide`);
            break;
          case "invalidPassword":
            console.log(`El password es debil`);
            messages.push(`El password no es fuerte`);
            break;

            

        }
      }
    }
    //console.log('errores ',messages)
    return messages;
  }

  hayImagen() {
    return this.user.photoURL != '';
  }

  ngOnInit(): void {
  }

}
