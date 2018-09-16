import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ODataQueryService } from '../../../../shared/services/injectable/ODataQueryService';
import { User } from '../../../../shared/services/dto/User';
import { environment } from '../../../../environments/environment';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { compare } from 'fast-json-patch';
import { format } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { HttpLoading } from '../../../../shared/services/injectable/HttpLoading';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  allChecked = false;
  indeterminate = false;
  visibleDrawer = false;
  // loading = false;
  dataSet: any[];
  updateItem: any;
  schema: any;
  schemaType = 'employees';
  pageindex = 1;
  pagesize = 10;
  total: number;
  sortName: string = null;
  sortValue: string = null;
  sortMap = {};
  cloumns = [];
  filters = [];
  showFilter = false;

  constructor(
    protected service: ODataQueryService<User>,
    private http: HttpClient,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    public loading: HttpLoading
  ) {
    console.log(loading.value);
  }
  refreshStatus(): void {
    const allChecked = this.dataSet.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.dataSet.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
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
      || (n.name === odataProperty.name && n.operard !== op && odataProperty.format !== 'date-time'));
    if (value) {
      switch (op) {
        case OdataOperard.Equals:
        case OdataOperard.GreaterThan:
        case OdataOperard.GreaterThanOrEqual:
        case OdataOperard.LessThan:
        case OdataOperard.LessThanOrEqual:
        case OdataOperard.NotEquals:
          if (odataProperty.format === 'date-time') {
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
        props.name = i;
        this.cloumns = [...this.cloumns, props];
      }
    }
  }
  save(item): void {
    if (this.updateItem.Id == null) {
      this.service.Create(item).subscribe((data) => {
        this.dataSet = [data, ...this.dataSet];
        this.visibleDrawer = false;
      });
    } else {
      const apply = compare(this.updateItem, item);
      if (apply.length === 0) { return; }
      this.service.UpdateByPatch(apply, item.Id).subscribe((data) => {
        const rowIndex = this.dataSet.findIndex((n) => n.Id === item.Id);
        this.dataSet[rowIndex] = data.body;
        this.visibleDrawer = false;
      });

    }

  }

  getpage(pageindex: number, pagesize: number, sort?: string, filter?: string) {
    this.pagesize = pagesize;
    this.pageindex = pageindex;
    this.service.Page(pageindex, pagesize, sort || 'CreatedDate desc', filter).subscribe((o) => {
      this.dataSet = o.data;
      this.total = o.count;
      this.refreshStatus();
    });
  }
  ngOnInit() {
    this.service.init('employees');
    this.http.get(`${environment.jsonSchemaUrl}/${this.schemaType}`)
      .subscribe((data: any) => {
        this.schema = data;
        this.schema.ui = { grid: { span: 12, gutter: 10 } };
        this.initColumns();
      });
    this.getpage(this.pageindex, this.pagesize);
  }

}

enum OdataOperard {
  Contains = 'contains',
  Equals = 'eq',
  GreaterThan = 'gt',
  GreaterThanOrEqual = 'ge',
  NotEquals = 'ne',
  LessThan = 'lt',
  LessThanOrEqual = 'le',
  And = 'and',
  Or = 'or',
  Not = 'not'
}
