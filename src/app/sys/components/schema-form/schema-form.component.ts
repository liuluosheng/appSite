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
export class SchemaFormComponent implements OnChanges {
  layout: 'horizontal'|'vertical' = 'vertical';
  names: any[];
  @Input()
   schema: any;

  @Input()
  data: any = {};



  validateForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) { }

  submit(value) {
  console.log(value);
  }
  initValidateForm() {
    const controls: any = {};
    this.names = Object.keys(this.schema.properties);
    this.names.forEach((key) => {
      let validators = [];
      if (this.schema.required.findIndex((v) => v === key) !== -1) {
        validators = [...validators, Validators.required];
      }
      if (this.schema.properties[key].pattern) {
        validators = [...validators, Validators.pattern(this.schema.properties[key].pattern)];
      }
      controls[key] = [this.data[key], validators];
    });
    this.validateForm = this.fb.group(controls);
    console.log(this.validateForm);
  }
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    const schemaIndex = Object.keys(changes).findIndex((key) => key === 'schema');
    if (schemaIndex !== -1 && changes['schema'].previousValue != null) {
      this.initValidateForm();
    }
   }
  }



