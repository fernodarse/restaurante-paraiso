
import { Component, Input, OnInit } from '@angular/core';
import { Comments } from 'src/app/models/comment';

@Component({
  selector: 'app-testimonio',
  templateUrl: './testimonio.component.html',
  styleUrls: ['./testimonio.component.css']
})
export class TestimonioComponent implements OnInit {

  @Input("testimonio") coment: Comments;

  constructor() { }

  ngOnInit(): void {
  }

}
