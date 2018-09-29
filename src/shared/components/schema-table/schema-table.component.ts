import { Component, OnInit, Input, TemplateRef, ViewContainerRef, ContentChildren, QueryList, AfterContentInit } from '@angular/core';

import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { compare } from 'fast-json-patch';
import { format } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ODataQueryService } from '../../../core/services/injectable/oDataQuery.service';
import { HttpLoading } from '../../../core/services/injectable/httpLoading.service';
import { EntityBase } from 'src/shared/dto/EntityBase';
import { OdataOperard } from 'src/shared/const/odataOperard.enum';
import { TableActionComponent } from './schema-table.action.component';


@Component({
  selector: 'app-schema-table',
  templateUrl: './schema-table.component.html',
  styleUrls: ['./schema-table.component.less']
})
export class SchemaTableComponent implements OnInit, AfterContentInit {

  private allChecked = false;
  private indeterminate = false;
  private visibleDrawer = false;
  private dataSet: any[];
  private updateItem: any;
  private schema: any[];
  private loading = true;
  private pageindex = 1;
  private pagesize = 10;
  private total: number;
  private sortName: string = null;
  private sortValue: string = null;
  private sortMap = {};
  private cloumns = [];
  private filters = [];
  private showFilter = false;
  private rowActions: any[];
  private tableActions: any[];
  constructor(
    private service: ODataQueryService<EntityBase>,
    private http: HttpClient,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private httpLoading: HttpLoading
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
    this.filters = [];
    this.getpage(this.pageindex, this.pagesize);
  }
  filter(odataProperty: any, op: OdataOperard, value: any): void {
    const lastFilterString = this.filters.map((o) => o.value).join(` ${OdataOperard.And} `);
    this.filters = this.filters.filter((n) => n.name !== odataProperty.name
      || (n.name === odataProperty.name && n.operard !== op && odataProperty.type !== 'datetime'));
    if (value || value === false || value === 0) {
      switch (op) {
        case OdataOperard.Equals:
        case OdataOperard.GreaterThan:
        case OdataOperard.GreaterThanOrEqual:
        case OdataOperard.LessThan:
        case OdataOperard.LessThanOrEqual:
        case OdataOperard.NotEquals:
          if (odataProperty.type === 'datetime') {
            if (value.length !== 0) {
              this.filters = [...this.filters,
              {
                name: odataProperty.name,
                operard: OdataOperard.GreaterThanOrEqual,
                value:
                  `${odataProperty.name} ${OdataOperard.GreaterThanOrEqual} ${format(value[0])}`
              },
              {
                name: odataProperty.name,
                operard: OdataOperard.LessThanOrEqual,
                value:
                  `${odataProperty.name} ${OdataOperard.LessThanOrEqual} ${format(value[1])}`
              }
              ];
            }
          } else {
            this.filters = [...this.filters, {
              name: odataProperty.name,
              operard: op,
              value:
                odataProperty.enum ?
                  `${odataProperty.name} ${op} '${value}'` :
                  `${odataProperty.name} ${op} ${value}`
            }];
          }
          break;
        case OdataOperard.Contains:
          this.filters = [...this.filters, {
            name: odataProperty.name,
            operard: op,
            value: `${op}(${odataProperty.name}, '${value}')`
          }];
          break;
      }
    }
    const filterString = this.filters.map((o) => o.value).join(` ${OdataOperard.And} `);
    if (lastFilterString !== filterString) {
      this.getpage(this.pageindex, this.pagesize, null, filterString);
    }
    console.log(filterString);
  }
  sort(sortName: string, value: string): void {
    if (!value) { return; }
    this.sortName = sortName;
    this.sortValue = value;
    for (const key in this.sortMap) {
      if (this.sortMap.hasOwnProperty(key)) {
        this.sortMap[key] = (key === sortName ? value : null);
      }
    }
    this.getpage(this.pageindex, this.pagesize, `${sortName} ${this.sortValue.replace('end', '')}`);
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

  getpage(pageindex: number, pagesize: number, sort?: string, filter?: string) {
    this.loading = true;
    this.pagesize = pagesize;
    this.pageindex = pageindex;
    this.service.init(this.schemaType).Page(pageindex, pagesize, sort || 'CreatedDate desc', filter).subscribe((o) => {
      this.dataSet = o.data;
      this.total = o.count;
      this.refreshStatus();
      this.loading = false;
    });
  }
  ngOnInit() {
    this.http.get(`${environment.jsonSchemaUrl}/${this.schemaType}`)
      .subscribe((data: any) => {
        this.schema = data;
      });
    this.getpage(this.pageindex, this.pagesize);
  }
  ngAfterContentInit(): void {
    /// 加载表格自定义操作
    this.rowActions = this.actions.filter(x => x.type === 'row');
    this.tableActions = this.actions.filter(x => x.type === 'table');
  }
}

