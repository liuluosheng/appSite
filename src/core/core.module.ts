import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { AuthConfig } from 'angular-oauth2-oidc';
import { oAuthConfig } from './config/oauthConfig';
import { ODataConfiguration, ODataServiceFactory } from 'angular-odata-es5';
import { ODataConfigurationFactory } from './config/odataConfig';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultInterceptor } from './services/interceptor/default.interceptor';
import { AuthGuard } from './services/guard/auth.guard';
import { HttpLoading } from 'src/core/services/injectable/http.Loading';
import { ODataQueryService } from 'src/core/services/injectable/oData.QueryService';



@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: AuthConfig, useValue: oAuthConfig },
    { provide: ODataConfiguration, useClass: ODataConfigurationFactory },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    HttpLoading,
    AuthGuard,
    ODataQueryService,
    ODataServiceFactory],
})
/// CoreModule为服务定义模块 仅在AppModule模块中导入
export class CoreModule { }
