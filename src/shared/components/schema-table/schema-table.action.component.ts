import { Component, OnInit, ContentChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-table-action',
    template: `<ng-content><ng-template></ng-template></ng-content>`
})

export class TableActionComponent implements OnInit {
    @ContentChild(TemplateRef) content;
    @Input() name = 'Not set Name';
    @Input() type: 'row' | 'table' = 'row';
    @Input() show: 'modal' | 'drawer' = 'drawer';
    @Input() icon: string;
    constructor() { }
    open() {
        // this.viewContainer.createEmbeddedView(this.addNewContent);
    }
    ngOnInit() { }
}
