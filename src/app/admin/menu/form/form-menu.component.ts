import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NgForm } from "@angular/forms";
import { Menu } from "../../../models/menu";
import { MODES, SharedState, SHARED_STATE } from "../../../models/sharedState.model";
import { Observable } from "rxjs";
import { DatePipe } from '@angular/common';
import { CategoriaMenu, ListCategoriaMenu } from 'src/app/models/staticts';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Utils } from 'src/app/services/utils';
import { FileDropboxService } from 'src/app/models/file-dropbox.service';
import { MenuRestService } from 'src/app/models/menu-rest.service';
import { FileRestService } from 'src/app/models/file-rest.service';

@Component({
  selector: 'form-menu',
  templateUrl: './form-menu.component.html',
  styleUrls: ['./form-menu.component.css'],
  providers: [DatePipe]
})
export class FormMenuComponent implements OnInit {

  menu: Menu = new Menu();

  confirmPassword = '';

  selectedFile: File = null;
  porcentage = 0;
  fileAttr = 'Choose File';

  static books: any[];
  CLIENT_ID: string = 'xiwj9otkq6ohsga';// App key from Dropbox; : xiwj9otkq6ohsga
  FILE_NAME: string = "/BookList.txt"; // Or whatever you want the file to be named where the data is stored
  authUrl: string;
  dropboxToken: string
  isAuthenticated: boolean
  static isLoading: boolean;
  localUrl: string;
  localDataFile: string;

  constructor(private menuServices: MenuRestService,
    @Inject(SHARED_STATE) public stateEvents: Observable<SharedState>,
    private datePipe: DatePipe,
    private uploadService: FileRestService,
    private uploadDropboxService: FileDropboxService,
    private listCategoriaMenu: ListCategoriaMenu,
    private snackBarService: SnackbarService,) {

    stateEvents.subscribe((update) => {
      if (update.mode != MODES.FIND) {
        this.menu = new Menu();
        console.log('recibiendo en form', update);
        if (update.id != undefined) {
          this.menuServices.getMenubyId(update.id).subscribe(result => {
            console.log('busqueda x id', result)
            Object.assign(this.menu, result);
            this.menu.menuId = update.id;
          });
        }
        this.editing = update.mode == MODES.EDIT;
        this.porcentage = 0
        this.selectedFile = null;
        this.fileAttr = 'Choose File';
      }
    });

  }

  editing: boolean = false;

  submitForm(form: NgForm) {
    if (form.valid) {
      console.log('submit menu', this.menu);
      if (this.editing) {
        this.menuServices.updateMenu(this.menu.menuId, this.menu).then(
          () => {
            this.snackBarService.openSnackBar('El menú se modificó correctamente');
          }
        );
      } else {
        this.menu.createdDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm');
        this.menuServices.createMenu(this.menu).then(
          () => {
            this.snackBarService.openSnackBar('El menú se creo satifactioramente');
          }
        );;
      }
      //form.reset();
      //this.resetForm();
    }
  }
  resetForm() {
    this.menu = new Menu();
    this.porcentage = 0
    this.selectedFile = null;
    this.fileAttr = 'Choose File';
  }

  ngOnInit(): void {
  }

  onFileSelected(event) {
    let file = event.target.files[0]
    this.selectedFile = file;
    this.porcentage = 0;
    this.fileAttr = file.name;
    //this.upload();
    this.uploadDropbox()

  }

  upload() {
    if (this.selectedFile) {
      this.uploadService.pushFileToStorage(this.selectedFile, this.menu.datosImg).subscribe(
        percentage => {
          this.porcentage = Math.round(percentage ? percentage : 0);
          console.log('subido url', this.menu.datosImg)
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  uploadDropbox() {
    if (this.selectedFile) {
      this.uploadDropboxService.pushFileToStorage(this.selectedFile, this.menu.datosImg).subscribe(
        percentage => {
          this.porcentage = Math.round(percentage ? percentage : 0);
          //console.log('subido url', this.menu.datosImg)
        },
        error => {
          console.log(error);
        }
      );

    }
  }

  hayImagen() {
    return this.menu.datosImg.url != '';
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
        }
      }
    }
    //console.log('errores ',messages)
    return messages;
  }

  categoriaMenu(): CategoriaMenu[] {
    return this.listCategoriaMenu.categoriaMenu;
  }
}
