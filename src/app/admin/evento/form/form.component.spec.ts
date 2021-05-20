import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEventoComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormEventoComponent;
  let fixture: ComponentFixture<FormEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormEventoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
