import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './passport/login/login.component';
import { Exception403Component } from './exception/exception403/exception403.component';
import { Exception404Component } from './exception/exception404/exception404.component';
import { AuthGuard } from '../../core/services/guard/auth.guard';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from '../wms/dashboard/dashboard.component';
import { PartComponent } from '../wms/part/part.component';
import { DefaultLayoutComponent } from './layout/default/default.component';
import { OrdersComponent } from '../wms/orders/orders.component';
import { UsersComponent } from './identity/users/users.component';
import { SysMenuComponent } from './identity/sys-menu/sys-menu.component';
import { TestComponent } from '../wms/test/test.component';

const routes: Routes = [
  {
    path: '', component: DefaultLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: IndexComponent },
      {
        path: 'identity', canActivate: [AuthGuard],
        children: [
          { path: 'users', component: UsersComponent },
          { path: 'menus', component: SysMenuComponent }
        ]
      },
      {
        path: 'wms', canActivate: [AuthGuard],
        children: [
          { path: '', component: DashboardComponent },
          { path: 'part', component: PartComponent },
          { path: 'test', component: TestComponent },
          { path: 'orders', component: OrdersComponent }
        ]
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '404', component: Exception404Component },
  { path: '403', component: Exception403Component },
  { path: '**', component: Exception404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
