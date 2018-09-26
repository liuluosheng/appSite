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

const routes: Routes = [
  {
    path: '', component: DefaultLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: IndexComponent, data: { title: 'index' } }
    ]

  },

  {
    path: 'identity', component: DefaultLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent, data: { title: 'users' } }
    ]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'wms', component: DefaultLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: { title: 'dashboard' } },
      { path: 'part', component: PartComponent, data: { title: 'part' } },
      { path: 'orders', component: OrdersComponent, data: { title: 'orders' } }
    ]
  },
  { path: '404', component: Exception404Component },
  { path: '403', component: Exception403Component },
  { path: '**', component: Exception404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
