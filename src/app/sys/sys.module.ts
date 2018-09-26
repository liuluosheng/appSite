import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SysRoutingModule } from './sys-routing.module';
import { Exception404Component } from './exception/exception404/exception404.component';
import { Exception403Component } from './exception/exception403/exception403.component';
import { LoginComponent } from './passport/login/login.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DelonFormModule } from '@delon/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DefaultLayoutComponent } from './layout/default/default.component';
import { IndexComponent } from './index/index.component';
import { ScrollbarModule } from 'ngx-scrollbar';
import { UsersComponent } from './identity/users/users.component';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SysRoutingModule,
    DelonFormModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollbarModule,
    SharedModule
  ],
  declarations: [
    Exception404Component,
    Exception403Component,
    IndexComponent,
    LoginComponent,
    DefaultLayoutComponent,
    UsersComponent]
})
export class SysModule { }
