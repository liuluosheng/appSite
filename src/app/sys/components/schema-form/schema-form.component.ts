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
  names: any[];

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
  data: any = {};

  validateForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) { }

  submit(event) {
    console.log(this.validateForm.value);
  }
  initValidateForm() {
    const controls: any = {};
    this.names = Object.keys(this._schema.properties);
    this.names.forEach((key) => {
      let validators = [];
      if (this._schema.required.findIndex((v) => v === key) !== -1) {
        validators = [...validators, Validators.required];
      }
      if (this._schema.properties[key].pattern) {
        validators = [...validators, Validators.pattern(this._schema.properties[key].pattern)];
      }
      controls[key] = [this.data[key], validators];
    });
    this.validateForm = this.fb.group(controls);
    console.log(this.validateForm);
  }
  ngOnInit() {

  }
}



