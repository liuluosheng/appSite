import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';
import {
  AbstractControl,
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
  layout: 'horizontal'|'vertical' = 'vertical';
  _schema: any;
  names: any[];

  @Input()
  set schema(value: any) {
    if (value) {
    this._schema = value;
    this.initValidateForm();
    }
  }

  @Input()
   data: any = {};

  validateForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) { }

  submit(value) {
  console.log(value);
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



