import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-schema-form',
  templateUrl: './schema-form.component.html',
  styleUrls: ['./schema-form.component.less']
})
export class SchemaFormComponent implements OnInit, OnChanges {
  layout: 'horizontal' | 'vertical' = 'vertical';
  cols: 24 | 12 | 8 = 12; // 布局的列数： 24表示1列，12表示2列，8表示3列
  private _schema: any[];
  private _data: any;
  @Input()
  set schema(value: any) {
    if (value) {
      this.initValidateForm(value);
    }
  }
  get schema() {
    if (this._schema) {
      return {
        text: this._schema.filter((n) => n.type === 'string' || n.type === 'enum' || n.type === 'number' || n.type === 'datetime'),
        upload: this._schema.filter((n) => n.type === 'upload')
      };
    }
    return {};
  }
  @Input()
  set formData(value: any) {
    this._data = value;
  }
  get formData() {
    return this._data || {};
  }
  validateForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) { }

  submit(event) {
    Object.keys(this.validateForm.controls).forEach((i) => {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    });
    console.log(this.validateForm.value);
  }
  reset() {
    this.validateForm.reset();
  }
  initValidateForm(schema?: any) {
    const controls: any = {};
    const _props = schema ? Object.keys(schema.properties).map((value) => schema.properties[value]) : this._schema;
    _props.forEach((item) => {
      let validators = [];
      if (item.required) {
        validators = [...validators, Validators.required];
      }
      if (item.pattern) {
        validators = [...validators, Validators.pattern(item.pattern)];
      }
      if (item.minLength) {
        validators = [...validators, Validators.minLength(item.minLength)];
      }
      if (item.maxLength) {
        validators = [...validators, Validators.maxLength(item.maxLength)];
      }
      controls[item.name] = [this.formData[item.name], validators];
    });
    this.validateForm = this.fb.group(controls);
    this._schema = _props;
  }
  updateFormData(item: any) {
    Object.keys(this.validateForm.controls).forEach((key) => {
      this.validateForm.controls[key].setValue(item[key]);
    });
  }
  ngOnInit() {

  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    Object.keys(changes).forEach((key) => {
      if (key === 'formData' && changes[key].currentValue) {
        this.updateFormData(changes[key].currentValue);
      }
    });
  }
}
