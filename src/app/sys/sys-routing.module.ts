import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './passport/login/login.component';
import { Exception403Component } from './exception/exception403/exception403.component';
import { Exception404Component } from './exception/exception404/exception404.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
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
