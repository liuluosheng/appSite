import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WmsRoutingModule } from './wms-routing.module';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PartComponent } from './part/part.component';

@NgModule({
  imports: [
    CommonModule,
    WmsRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [IndexComponent, DashboardComponent, PartComponent]
})
export class WmsModule { }
