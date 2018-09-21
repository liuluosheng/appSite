import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PartComponent } from './part/part.component';
import { OrdersComponent } from './orders/orders.component';
import { SysModule } from '../sys/sys.module';

@NgModule({
  imports: [
    CommonModule,
    SysModule,
    NgZorroAntdModule
  ],
  declarations: [DashboardComponent, PartComponent, OrdersComponent]
})
export class WmsModule { }
