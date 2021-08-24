import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Evento } from 'src/app/models/evento';
import { EventoService } from 'src/app/models/evento.service';
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


  constructor(private eventoServices: EventoService,
    @Inject(SHARED_STATE) public stateEvents: Observable<SharedState>,
    private snackBarService: SnackbarService,
    private datePipe: DatePipe,) {

    stateEvents.subscribe((update) => {
      if (update.mode != MODES.FIND) {
        this.evento = new Evento();
        console.log('recibiendo en form', update);
        if (update.id != undefined) {
          this.eventoServices.getEventobyId(update.id).subscribe(result => {
            Object.assign(this.evento, result);
            this.evento.eventoId = update.id;
          });
        }
        this.editing = update.mode == MODES.EDIT;
      }
    });
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      console.log('submit menu', this.evento);
      if (this.editing) {
        this.eventoServices.updateEvento(this.evento.eventoId, this.evento).then(
          () => {
            this.snackBarService.openSnackBar('El evento se modificó correctamente');
          }
        );
      } else {
        this.evento.createdDate = this.datePipe.transform(Date.now(), 'MM-dd-yyyy HH:mm');
        this.eventoServices.createEvento(this.evento).then(
          () => {
            this.snackBarService.openSnackBar('El evento se creo satifactioramente');
          }
        );
      }
      form.reset();
    }
  }
  resetForm() {
    this.evento = new Evento();
  }
  ngOnInit(): void {
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

  hayImagen() {
    return this.evento.photoURL != '';
  }

}
