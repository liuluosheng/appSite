import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  constructor(protected router: Router,
    protected route: ActivatedRoute) {
  }

  ngOnInit() {

  }

}
