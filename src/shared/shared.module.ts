import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemaFormComponent } from './components/schema-form/schema-form.component';
import { SchemaTableComponent } from './components/schema-table/schema-table.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const declare: any[] =
[
  SchemaFormComponent,
  SchemaTableComponent
];
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [...declare],
  exports: [...declare]
})
/// SharedModule定义通用的组件，管道 指令，不能定义服务提供商
export class SharedModule { }
