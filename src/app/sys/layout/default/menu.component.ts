import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SystemMenu } from 'src/shared/dto/SystemMenu';


@Component({
    // tslint:disable-next-line:component-selector
    selector: '[app-menu]',
    template: `
    <ng-container *ngFor="let menu of menus">
        <li nz-menu-item (click)="navigate(menu)" *ngIf="menu.Items.length==0">
          <span>
            <i nz-icon [type]="menu.Icon"></i>
            <span class="nav-text">
              {{menu.Name}}
            </span>
          </span>
        </li>
        <li nz-submenu *ngIf="menu.Items.length!=0">
          <span title>
          <i nz-icon [type]="menu.Icon"></i>
            <span class="nav-text">{{menu.Name}}</span>
          </span>
          <ul app-menu [menus]="menu.Items" (select)="selectmenu($event)">
          </ul>
        </li>

    </ng-container>
 `
})
export class MenuComponent implements OnInit {
    constructor( protected router: Router) { }
    @Input() menus: any[];
    @Output() select = new EventEmitter<SystemMenu>();
    navigate(menu) {
    this.router.navigateByUrl(menu.Url);
    this.select.emit(menu);
    }
    selectmenu(menu) {
      this.select.emit(menu);
    }
    ngOnInit(): void { }
}
