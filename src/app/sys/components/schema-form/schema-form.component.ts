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
export class SchemaFormComponent implements OnInit {
  layout: 'horizontal' | 'vertical' = 'vertical';
  cols: 24 | 12 | 8 = 12; // 布局的列数： 24表示1列，12表示2列，8表示3列
  private _schema: any;
  private _data: any = {};
  @Input()
  set schema(value: any) {
    if (value) {
      this._schema = value;
      this.initValidateForm();
    }
  }
  get schema() {
    if (this._schema) {
      return Object.keys(this._schema.properties).map((value) => this._schema.properties[value]);
    }
  }
  @Input()
  set data(value: any) {
    this._data = value;
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
  initValidateForm() {
    const controls: any = {};

    this.schema.forEach((item) => {
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
      controls[item.name] = [this._data[item.name], validators];
    });
    this.validateForm = this.fb.group(controls);
    console.log(this.validateForm);
  }
  ngOnInit() {

  }
}



