import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
@Component({
  selector: 'app-exception404',
  templateUrl: './exception404.component.html',
  styleUrls: ['./exception404.component.less']
})
export class Exception404Component implements OnInit {

  constructor() { }
  choose(e): void {
    console.log(format(e[0]));
    console.log(format(e[1]));
  }
  ngOnInit() {
  }

}
