import { Component, OnInit, Input, SimpleChange, OnChanges, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { deepClone } from 'fast-json-patch/lib/core';
import { environment } from '../../../environments/environment';
import { Schema } from '../../../core/declare/schema.class';



@Component({
  selector: 'app-schema-form',
  templateUrl: './schema-form.component.html',
  styleUrls: ['./schema-form.component.less']
})
export class SchemaFormComponent implements OnInit, OnChanges {
  layout: 'horizontal' | 'vertical' = 'vertical';
  cols: 24 | 12 | 8 = 12; // 布局的列数： 24表示1列，12表示2列，8表示3列

  private _data: any;
  uploadFileList?: any = {};
  validateForm: FormGroup = new FormGroup({});
  private controls: any = {};
  @Input()
  set schema(value: Schema) {
    if (value) {
      this.initValidateForm(value);
      const editable = value.properties.filter((v) => !v.columnSetting || v.columnSetting.editable !== false);
      this.controls = {
        text: editable.filter((n) =>
          n.type === 'Text' ||
          n.type === 'Select' ||
          n.type === 'Number' ||
          n.type === 'Autocomplete' ||
          n.type === 'Switch' ||
          n.type === 'DateTime'),
        upload: editable.filter((n) => n.type === 'Upload')
      };
    }
  }
  @Input()
  set formData(value: any) {
    this._data = value;
  }
  get formData() {
    return this._data || {};
  }
  @Output() formSumbit = new EventEmitter<any>();
  constructor(private fb: FormBuilder) {
  }
  /// 表单提交
  submit() {
    Object.keys(this.validateForm.controls).forEach((i) => {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    });
    if (this.validateForm.valid) {
      this.formSumbit.emit(Object.assign(deepClone(this.formData), this.validateForm.value));
    }
  }
  reset() {
    this.validateForm.reset();
  }
  /// 初始化一个FormGroup
  initValidateForm(schema: Schema) {
    const controls: any = {};
    const _props = schema.properties;
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
    // this._schema = _props;
  }
  /// 更新表单项目值
  updateFormData(item: any) {
    Object.keys(this.validateForm.controls).forEach((key) => {
      this.validateForm.controls[key].setValue(item[key]);
    });
  }
  /// 更新编辑表单时上传控件的文件list
  /// 与api的filescontroller配合使用
  fileUploadList() {
    if (this.controls.upload) {
      this.controls.upload.forEach((v) => {
        const _value = this.validateForm.controls[v.name].value;
        const reg = /(^|&)?name=([^&]*)(&|$)/;
        if (_value && _value.search(reg) !== -1) {
          this.uploadFileList[v.name] = [{
            name: _value.match(reg)[0].split('=')[1],
            url: `${environment.apiUrl}/${_value}`,
            response: {
              result: _value
            }
          }];
        } else {
          this.uploadFileList[v.name] = [];
        }
      });
    }
  }
  /// 文件上传控件的状态更改触发事件
  fileUpload(event, schema): void {
    const control = this.validateForm.controls[schema.name];
    if (event.type === 'success') {
      control.setValue(event.file.response.result);
    }
    if (event.type === 'removed') {
      if (event.file.response.result === control.value) {
        const c = event.fileList.length;
        if (c !== 0) {
          control.setValue(event.fileList[c - 1].response.result);
        } else {
          control.setValue(null);
        }
      }
    }
  }

  ngOnInit() {

  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    Object.keys(changes).forEach((key) => {
      if (key === 'formData' && changes[key].currentValue) {
        this.updateFormData(changes[key].currentValue);
        this.fileUploadList();
      }
    });
  }
}
