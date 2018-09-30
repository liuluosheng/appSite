import { Component, OnInit, Input, ContentChildren, QueryList, AfterContentInit, SimpleChange, OnChanges } from '@angular/core';

import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { compare } from 'fast-json-patch';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ODataQueryService } from '../../../core/services/injectable/oDataQuery.service';
import { HttpLoading } from '../../../core/services/injectable/httpLoading.service';
import { EntityBase } from 'src/shared/dto/EntityBase';
import { TableActionComponent } from './schema-table.action.component';
import { OdataFilterFactory } from 'src/core/services/injectable/oDataFilterFactory.service';
import { Page } from '../../../core/declare/page.class';
import { Schema } from '../../../core/declare/schema.class';


@Component({
  selector: 'app-schema-table',
  templateUrl: './schema-table.component.html',
  styleUrls: ['./schema-table.component.less']
})
export class SchemaTableComponent implements OnInit, AfterContentInit, OnChanges {

  private allChecked = false;
  private indeterminate = false;
  private visibleDrawer = false;
  private dataSet: any[] = [];
  private updateItem: any;
  private loading = true;
  private sortMap = {};
  private filterObj = {};
  private showFilter = false;
  private rowActions: any[];
  private tableActions: any[];
  private page = new Page();
  private schema = new Schema();
  constructor(
    private service: ODataQueryService<EntityBase>,
    private http: HttpClient,
    private httpLoading: HttpLoading,
    private odateFilterFactory: OdataFilterFactory
  ) {

  }
  /// 必须要指定的类型
  @Input() schemaType: string;
  @ContentChildren(TableActionComponent) actions: QueryList<TableActionComponent>;
  refreshStatus(): void {
    const allChecked = this.dataSet.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.dataSet.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }
  transformUrl(url): string {
    return `${environment.apiUrl}/${url}`;
  }
  checkAll(value: boolean): void {
    this.dataSet.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }
  clearFilter(): void {
    this.showFilter = false;
    this.filterObj = {};
    this.getpage();
  }
  sort(sortName: string, value: string): void {
    if (!value) { return; }
    for (const key in this.sortMap) {
      if (this.sortMap.hasOwnProperty(key)) {
        this.sortMap[key] = (key === sortName ? value : null);
      }
    }
    this.page.orderBy = `${sortName} ${value.replace('end', '')}`;
    this.getpage();
  }
  save(item): void {
    this.loading = true;
    if (this.updateItem.Id == null) {
      this.service.init(this.schemaType).Create(item).subscribe((data) => {
        this.dataSet = [data, ...this.dataSet];
        this.visibleDrawer = false;
        this.loading = false;
      });
    } else {
      const apply = compare(this.updateItem, item);
      if (apply.length === 0) { return; }
      this.service.init(this.schemaType).UpdateByPatch(apply, item.Id).subscribe((data) => {
        const rowIndex = this.dataSet.findIndex((n) => n.Id === item.Id);
        this.dataSet[rowIndex] = data.body;
        this.visibleDrawer = false;
        this.loading = false;
      });

    }

  }
  getpage() {
    this.loading = true;
    this.odateFilterFactory.Create(this.schema).CreatePageData(this.page, this.filterObj).subscribe((o) => {
      this.dataSet = o.data;
      this.page.total = o.count;
      this.refreshStatus();
      this.loading = false;
    });
  }
  ngOnInit() {
    this.http.get(`${environment.jsonSchemaUrl}/${this.schemaType}`)
      .subscribe((data: any) => {
        this.schema = data;
        this.getpage();
      });
  }
  ngAfterContentInit(): void {
    /// 加载表格自定义操作
    this.rowActions = this.actions.filter(x => x.type === 'row');
    this.tableActions = this.actions.filter(x => x.type === 'table');
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    Object.keys(changes).forEach((key) => {
      if (key === 'filterObj') {
        this.filterObj = changes[key].currentValue;
        this.getpage();
      }
    });
  }
}

