import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ODataQueryService } from '../../../../shared/services/injectable/ODataQueryService';
import { User } from '../../../../shared/services/dto/User';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { SFComponent } from '@delon/form';
import { compare } from 'fast-json-patch';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  allChecked = false;
  indeterminate = false;
  loading = true;
  dataSet: any[];
  updateItem: any;
  schema = { properties: {} };
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
  @ViewChild(SFComponent)
  private sf: SFComponent;
  constructor(
    protected service: ODataQueryService<User>,
    private http: HttpClient,
    private modalService: NzModalService,
    private notification: NzNotificationService,
  ) { }
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
  filter(odataProperty: any, op: OdataOperard, value: string): void {
    const lastFilterString = this.filters.map((o) => o.value ).join(` ${OdataOperard.And} `);
    this.filters = this.filters.filter((n) => n.name !== odataProperty.name || ( n.name === odataProperty.name && n.operard !== op));
    if (value) {
     switch (op) {
      case OdataOperard.Equals:
      case OdataOperard.GreaterThan:
      case OdataOperard.GreaterThanOrEqual:
      case OdataOperard.LessThan:
      case OdataOperard.LessThanOrEqual:
      case OdataOperard.NotEquals:
      this.filters = [...this.filters, {
        name: odataProperty.name,
        operard: op,
        value: odataProperty.enum ?
        `${odataProperty.name} ${op} '${value}'` :
        `${odataProperty.name} ${op} ${value}`}];
      break;
      case OdataOperard.Contains:
      this.filters = [...this.filters, {
        name: odataProperty.name,
        operard: op,
        value: `${op}(${odataProperty.name}, '${value}')`}];
      break;
     }
    }
    const filterString = this.filters.map((o) => o.value ).join(` ${OdataOperard.And} `);
    if (lastFilterString !== filterString  ) {
    this.getpage(this.pageindex, this.pagesize, null, filterString );
    }
     console.log(filterString);
  }
  sort(sortName: string, value: string): void {
    this.sortName = sortName;
    this.sortValue = value;
    for (const key in this.sortMap) {
      if (this.sortMap.hasOwnProperty(key)) {
        this.sortMap[ key ] = (key === sortName ? value : null);
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
  modal(tplContent: TemplateRef<{}>, item: User, title: string, rowIndex: number) {
    this.modalService.create({
      nzTitle: title,
      nzContent: tplContent,
      nzOnOk: () => {
        this.sf.validator();
        if (this.sf.valid) {
          this.loading = true;
          if (item == null) {
            this.service.Create(this.sf.value).subscribe((data) => {
              this.dataSet = [data, ...this.dataSet];
              this.loading = false;
            });
          } else {
            this.service.UpdateByPatch(compare(item, this.sf.value), item.Id).subscribe((data) => {
             this.dataSet[rowIndex] = data.body;
             this.loading = false;
            });
          }

        } else {
          this.notification.error('Error', '数据检验失败！');
          return false;
        }

      }
    });
  }
  getpage(pageindex: number, pagesize: number, sort?: string, filter?: string) {
    this.loading = true;
    this.service.Page(pageindex, pagesize, sort || 'CreatedDate', filter).subscribe((o) => {
      this.dataSet = o.data;
      this.total = o.count;
      this.loading = false;
      this.refreshStatus();
    });
  }
  ngOnInit() {
    this.service.init('employees');
    this.http.get(`${environment.jsonSchemaUrl}/${this.schemaType}`)
      .subscribe((data: any) => {
        this.schema = data;
        this.initColumns();
      });
    this.getpage(this.pageindex, this.pagesize);
  }

}

enum OdataOperard {
  Contains = 'contains',
  Equals = 'eq',
  GreaterThan = 'gt',
  GreaterThanOrEqual= 'ge',
  NotEquals = 'ne',
  LessThan = 'lt',
  LessThanOrEqual = 'le',
  And= 'and',
  Or= 'or',
  Not= 'not'
}
