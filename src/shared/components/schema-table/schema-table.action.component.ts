import { Component, OnInit, ContentChild, TemplateRef, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';


@Component({
    selector: 'app-table-action',
    template: `<ng-content></ng-content>`
})

export class TableActionComponent implements OnInit {
    @Input() name = '未定义名称';
    @Input() type: 'row' | 'table' = 'row';
    @Input() icon: string;
    @Input() data: any;
    @Input() visible = false;
    constructor() {
    }
    open(data) {
        this.data = data;
        this.visible = true;
    }
    ngOnInit() { }
}
