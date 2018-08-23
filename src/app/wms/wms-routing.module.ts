import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PartComponent } from './part/part.component';

const routes: Routes = [
  {
    path: 'wms', component: IndexComponent,
    children: [
      { path: '', component: DashboardComponent, data: { title: 'dashboard' } },
      { path: 'part', component: PartComponent, data: { title: 'part' } }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WmsRoutingModule {

}
