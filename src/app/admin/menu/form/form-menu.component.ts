import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NgForm } from "@angular/forms";
import { Menu } from "../../../models/menu";
import { MenuService } from "../../../models/menu.service";
import { MODES, SharedState, SHARED_STATE } from "../../../models/sharedState.model";
import { Observable } from "rxjs";
import { DatePipe } from '@angular/common';
import { FileService } from 'src/app/models/file.service';
import { CategoriaMenu, ListCategoriaMenu } from 'src/app/models/staticts';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'form-menu',
  templateUrl: './form-menu.component.html',
  styleUrls: ['./form-menu.component.css'],
  providers: [DatePipe]
})
export class FormMenuComponent implements OnInit {

  menu: Menu = new Menu();

  selectedFile: File = null;
  porcentage = 0;
  fileAttr = 'Choose File';

  constructor(private menuServices: MenuService,
    @Inject(SHARED_STATE) public stateEvents: Observable<SharedState>,
    private datePipe: DatePipe,
    private uploadService: FileService,
    private listCategoriaMenu: ListCategoriaMenu, 
    private snackBarService: SnackbarService,) {

    stateEvents.subscribe((update) => {
      this.menu = new Menu();
      console.log('recibiendo en form', update);
      if (update.id != undefined) {
        this.menuServices.getMenubyId(update.id).subscribe(result => {
          Object.assign(this.menu, result);
          this.menu.menuId = update.id;
        });
      }
      this.editing = update.mode == MODES.EDIT;
      this.porcentage = 0
      this.selectedFile = null;
      this.fileAttr = 'Choose File';
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
      form.reset();
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
    let file=event.target.files[0]
    this.selectedFile = file;
    this.porcentage = 0;
    this.fileAttr = file.name;
    this.upload();
  }

  upload(){
    if (this.selectedFile) {
        this.uploadService.pushFileToStorage(this.selectedFile,this.menu.datosImg).subscribe(
          percentage => {
            this.porcentage = Math.round(percentage ? percentage : 0);
            /*this.nombreFichero=this.uploadService.name;
            this.url=this.uploadService.url;
            console.log('subido ',this.nombreFichero)
            console.log('subido url',this.url)*/
            console.log('subido url',this.menu.datosImg)
          },
          error => {
            console.log(error);
          }
        );
      }     
  }

  hayImagen(){
    return this.menu.datosImg.url !='';
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

  categoriaMenu(): CategoriaMenu[]{
    return this.listCategoriaMenu.categoriaMenu;
  }
}
