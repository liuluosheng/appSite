import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-schema-form',
  templateUrl: './schema-form.component.html',
  styleUrls: ['./schema-form.component.less']
})
export class SchemaFormComponent implements OnInit {

  @Input()
  schema: any = { properties: {} };
  validateForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    const controls: any = {};
    for (const key in this.schema.properties) {
      if (this.schema.properties.hasOwnProperty(key)) {
        const element = this.schema.properties[key];

      }
    }
    this.validateForm = this.fb.group(controls);
  }

}
