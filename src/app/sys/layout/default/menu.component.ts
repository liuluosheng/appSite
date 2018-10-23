import { Component, OnInit, Input } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: '[app-menu]',
    template: `
    <ng-container *ngFor="let menu of menus">
        <li nz-menu-item routerLink="menu.Url"
         routerLinkActive="active" [nzSelected]="selected(menu.Url)" *ngIf="menu.Items.length==0">
          <span>
            <i class="anticon anticon-dashboard"></i>
            <span class="nav-text">
              {{menu.Name}}
            </span>
          </span>
        </li>
        <li nz-submenu *ngIf="menu.Items.length!=0">
          <span title>
            <i class="anticon anticon-user"></i>
            <span class="nav-text">{{menu.Name}}</span>
          </span>
          <ul app-menu [menus]="menu.Items">
          </ul>
        </li>

    </ng-container>
 `
})
export class MenuComponent implements OnInit {
    constructor() { }
    @Input() menus: any[];
    ngOnInit(): void { }
}
