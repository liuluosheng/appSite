import { Component, OnInit, Input, ViewChild, forwardRef } from '@angular/core';
import { HttpLoading } from 'src/core/services/injectable/http.Loading';
import { ODataQueryService } from 'src/core/services/injectable/oData.QueryService';
import { EntityBase } from 'src/shared/dto/EntityBase';
import { OdataOperard } from 'src/shared/const/odataOperard.enum';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzSelectComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-autocomplete',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AutocompleteComponent),
    }
  ],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.less']
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input() schemaType: string; // 表示实体类
  @Input() labelProp: string; // 表示选择后显示在文本框中的属性
  @Input() search: string; // 表示要按哪些属性来进行搜索
  @Input() placeHolder: string;
  @ViewChild(NzSelectComponent)
  private nzSelectComponent: NzSelectComponent ;
  optionList: any[] = [];
  get searchs() {
    return this.search.split(',');
  }

  getLabel(item: any) {
    return this.searchs.map((key) => item[key]).join(' ');
  }

  constructor(
    protected service: ODataQueryService<EntityBase>,
    protected loading: HttpLoading) { }
  onSearch(value: string): void {
   const filters =  this.searchs.map((v) => `${OdataOperard.Contains}(${v}, '${value}')`).join(` ${OdataOperard.Or} `);
   this.service.init(this.schemaType).Query(filters, 20).subscribe((data) => {
     this.optionList = data;
   });
  }
  writeValue(obj: any): void {
    this.nzSelectComponent.writeValue(obj);
    if (obj != null) {
    this.service.init(this.schemaType).GetById(obj).subscribe((data) => {
      this.optionList = [data];
    });
    }
    console.log(obj);
  }
  registerOnChange(fn: any): void {
    this.nzSelectComponent.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.nzSelectComponent.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.nzSelectComponent.nzDisabled = isDisabled;
  }
  ngOnInit() {
    this.service.init(this.schemaType);
  }

}
