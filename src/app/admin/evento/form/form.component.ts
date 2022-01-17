import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Evento } from 'src/app/models/evento';
import { EventoRestService } from 'src/app/models/evento-rest.service';
import { FileRestService } from 'src/app/models/file-rest.service';
import { MODES, SharedState, SHARED_STATE } from 'src/app/models/sharedState.model';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'form-evento',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormEventoComponent implements OnInit {

  evento: Evento = new Evento();
  editing: boolean = false;

  selectedFile: File = null;
  porcentage = 0;
  fileAttr = 'Choose File';

  @ViewChild('form') ngForm;

  constructor(private eventoServices: EventoRestService,
    @Inject(SHARED_STATE) public stateEvents: Observable<SharedState>,
    private snackBarService: SnackbarService,
    private datePipe: DatePipe,
    private uploadService: FileRestService,
    private formBuilder: FormBuilder) {

    stateEvents.subscribe((update) => {
      if (update.mode != MODES.FIND) {
        this.evento = new Evento();
        console.log('recibiendo en form', update);
        if (update.id != undefined) {
          this.eventoServices.getEventobyId(update.id).subscribe(result => {
            Object.assign(this.evento, result);
            this.evento.eventoId = update.id;
            if(this.evento.datosImg.url != ''){
              this.fileAttr=  this.evento.datosImg.url
              this.selectedFile=new File([],'');
            }else{
              this.fileAttr= 'Choose File'
              this.selectedFile= null
            }      
            
          });
        }else{
          this.fileAttr= 'Choose File'
          this.selectedFile= null
        }
        this.editing = update.mode == MODES.EDIT;
      }
    });
  }

  async submitForm(form: NgForm) {
    let reset = false;
    if (form.valid) {
      console.log('submit evento', this.evento);
      try {
        if (this.editing) {
          (await this.eventoServices.updateEvento(this.evento.eventoId, this.evento)).subscribe(
            (event) => {
              this.snackBarService.openSnackBar('El evento se modificó correctamente');
              this.resetForm();
            },(error) => {
              console.log('Error tratado', error);
              this.snackBarService.openSnackBar('Se ha producido un error, intentelo más tarde');
            });
        } else {
          this.evento.createdDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm');
          (await this.eventoServices.createEvento(this.evento)).subscribe(
            (event) => {
              console.log('Evento creado', event);
              this.snackBarService.openSnackBar('El evento se creo satifactioramente');
              this.resetForm();
            },
            (error) => {
              console.log('Error tratado', error);
              this.snackBarService.openSnackBar('Se ha producido un error, intentelo más tarde');
            });
        }

      } catch (Error) {
        console.log('error', Error)
        this.snackBarService.openSnackBar('Se ha producido un error, intentelo más tarde');
      }
    }
  }
  resetForm() {
    this.evento = new Evento();
    this.porcentage = 0
    this.selectedFile = null;
    this.fileAttr = 'Choose File';
    this.ngForm.resetForm();
  }
  ngOnInit(): void {
   /* this.ngForm = this.formBuilder.group({
      nombre: new FormControl('',[Validators.required]),
      destacado: new FormControl('',[Validators.required]),
      descripcion: new FormControl('',[Validators.required]),
      photoURL: new FormControl('',[Validators.required]),
      //photoURL: new FormControl('',[Validators.required]),
    }, { validator: this.matchPassword });*/
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
            messages.push(`La ${thing} tiene error de formato`);
            break;
        }
      }
    }
    //console.log('errores ',messages)
    return messages;
  }

  getValidationMessagesFile(state: any, thingName?: string) {
    let thing: string = state.path || thingName;//tiene el mombre del campo
    let messages: string[] = [];
    if (state.errors) {
      for (let errorName in state.errors) {
        switch (errorName) {
          case "OneFieldAtLess":
            messages.push(`Seleccione una imagen`);
            break;
        }
      }
    }
    //console.log('errores ',messages)
    return messages;
  }
  onFileSelected(event) {
    let file = event.target.files[0]
    this.selectedFile = file;
    this.porcentage = 0;
    this.fileAttr = file.name;
    this.upload();
    //this.uploadDropbox()
  }

  upload() {
    if (this.selectedFile) {
      this.uploadService.pushFileToStorage(this.selectedFile, this.evento.datosImg).subscribe(
        percentage => {
          this.porcentage = Math.round(percentage ? percentage : 0);
          console.log('subido url', this.evento.datosImg)
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
