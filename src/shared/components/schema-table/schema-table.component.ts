import { Component, OnInit, Input, ContentChildren, QueryList, AfterContentInit, SimpleChange, OnChanges, ViewChild } from '@angular/core';

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
import { SchemaFormComponent } from '../schema-form/schema-form.component';
import { from } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';


@Component({
  selector: 'app-schema-table',
  templateUrl: './schema-table.component.html',
  styleUrls: ['./schema-table.component.less']
})
export class SchemaTableComponent implements OnInit, AfterContentInit {

  private allChecked = false;
  private indeterminate = false;
  private visibleDrawer = false;
  private dataSet: any[] = [];
  private updateItem: any;
  private loading = true;
  private sortMap = {};
  private rowActions: any[];
  private tableActions: any[];
  private filterObj = {};
  private filterCount = 0;
  private page = new Page();
  private schema = new Schema();
  constructor(
    private service: ODataQueryService<EntityBase>,
    private http: HttpClient,
    private httpLoading: HttpLoading,
    private odateFilterFactory: OdataFilterFactory
  ) {
  }
  // 指定是否显示新建按钮
  @Input() showCreate = true;
  // 指定是否要显示搜索按钮
  @Input() showSearch = true;
  /// 必须要指定的类型
  @Input() schemaType: string;

  @ContentChildren(TableActionComponent) actions: QueryList<TableActionComponent>;
  @ViewChild('asp') formComponent: SchemaFormComponent;
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
    this.filterObj = {};
    this.page.filter = null;
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
  delete(item, rowIndex): void {
    this.loading = this.httpLoading.value;
    this.service.init(this.schemaType).Delete(item.Id).subscribe((data) => {
      this.dataSet.splice(rowIndex, 1);
    });
  }
  save(item): void {
    this.loading = this.httpLoading.value;
    if (this.updateItem.Id == null) {
      this.service.init(this.schemaType).Create(item).subscribe((data) => {
        this.updateAutoComleteValue(data);
        this.dataSet = [data, ...this.dataSet];
        this.visibleDrawer = false;
      });
    } else {
      const apply = compare(this.updateItem, item);
      if (apply.length === 0) { return; }
      this.service.init(this.schemaType).UpdateByPatch(apply, item.Id).subscribe((data) => {
        const rowIndex = this.dataSet.findIndex((n) => n.Id === item.Id);
        this.updateAutoComleteValue(data.body);
        this.dataSet[rowIndex] = data.body;
        this.visibleDrawer = false;
      });
    }

  }
  // 更新对象的导航属性，一般由AutoComlete组件指定
 private updateAutoComleteValue(data) {
    this.schema.properties.forEach((item) => {
      if (item.type === 'Autocomplete' && item.columnSetting && item.columnSetting.displayExpression) {
        from(this.formComponent.autoCompleteComponents.toArray()).pipe(
          filter((x) => x.schemaType === item.dataType),
          switchMap((x) => x.optionList)
        ).subscribe(i => {
          if (i.Id === data[item.name]) {
            const prop = item.columnSetting.displayExpression.split('.')[0];
            data[prop] = i;
          }
        });
      }
    });
  }
  getpage() {
    this.loading = true;
    this.filterCount = Object.keys(this.filterObj).filter((k) => this.filterObj[k] && this.filterObj[k].length !== 0).length;
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
        this.page.expand = this.schema.expand;
        this.getpage();
      });
  }
  ngAfterContentInit(): void {
    /// 加载表格自定义操作
    this.rowActions = this.actions.filter(x => x.type === 'row');
    this.tableActions = this.actions.filter(x => x.type === 'table');

  }
}

