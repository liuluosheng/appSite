import { Component, OnInit, Input } from '@angular/core';

import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { compare } from 'fast-json-patch';
import { format } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ODataQueryService } from 'src/core/services/injectable/oData.QueryService';
import { HttpLoading } from 'src/core/services/injectable/http.Loading';
import { EntityBase } from 'src/shared/dto/EntityBase';
import { OdataOperard } from 'src/shared/const/odataOperard.enum';


@Component({
  selector: 'app-schema-table',
  providers: [HttpLoading],
  templateUrl: './schema-table.component.html',
  styleUrls: ['./schema-table.component.less']
})
export class SchemaTableComponent implements OnInit {
 private _schemaType: string;
 private allChecked = false;
 private indeterminate = false;
 private visibleDrawer = false;
 private dataSet: any[];
 private updateItem: any;
 private schema: any;

 private pageindex = 1;
 private pagesize = 10;
 private total: number;
 private sortName: string = null;
 private sortValue: string = null;
 private sortMap = {};
 private cloumns = [];
 private filters = [];
 private showFilter = false;

  constructor(
    private service: ODataQueryService<EntityBase>,
    private http: HttpClient,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    public loading: HttpLoading
  ) {

  }
  /// 必须要指定的类型
  @Input()
  set schemaType(value) {
    this._schemaType = value;
  }
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
  hideFilter(): void {
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
  initColumns() {
    for (const i in this.schema.properties) {
      if (this.schema.properties.hasOwnProperty(i)) {
        const props = this.schema.properties[i];
        this.cloumns = [...this.cloumns, props];
      }
    }
  }
  save(item): void {
    this.service.init(this._schemaType);
    if (this.updateItem.Id == null) {
      this.service.init(this._schemaType).Create(item).subscribe((data) => {
        this.dataSet = [data, ...this.dataSet];
        this.visibleDrawer = false;
      });
    } else {
      const apply = compare(this.updateItem, item);
      if (apply.length === 0) { return; }
      this.service.init(this._schemaType).UpdateByPatch(apply, item.Id).subscribe((data) => {
        const rowIndex = this.dataSet.findIndex((n) => n.Id === item.Id);
        this.dataSet[rowIndex] = data.body;
        this.visibleDrawer = false;
      });

    }

  }

  getpage(pageindex: number, pagesize: number, sort?: string, filter?: string) {
    this.pagesize = pagesize;
    this.pageindex = pageindex;
    this.service.init(this._schemaType).Page(pageindex, pagesize, sort || 'CreatedDate desc', filter).subscribe((o) => {
      this.dataSet = o.data;
      this.total = o.count;
      this.refreshStatus();
    });
  }
  ngOnInit() {
    this.service.init(this._schemaType);
    this.http.get(`${environment.jsonSchemaUrl}/${this._schemaType}`)
      .subscribe((data: any) => {
        this.schema = data;
        this.schema.ui = { grid: { span: 12, gutter: 10 } };
        this.initColumns();
      });
    this.getpage(this.pageindex, this.pagesize);
  }


}

