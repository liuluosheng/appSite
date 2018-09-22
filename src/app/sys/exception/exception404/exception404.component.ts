import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exception404',
  templateUrl: './exception404.component.html',
  styleUrls: ['./exception404.component.less']
})
export class Exception404Component implements OnInit {
  schema: any;
  visible = false;
  constructor(private http: HttpClient) { }
  choose(e): void {
    console.log(format(e[0]));
    console.log(format(e[1]));
  }
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  ngOnInit() {
    this.http.get(`${environment.jsonSchemaUrl}/employees`)
      .subscribe((data: any) => {
        this.schema = data;
        this.schema.ui = { grid: { span: 12, gutter: 10 } };

      });
  }

}
