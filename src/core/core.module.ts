import { NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { AuthConfig } from 'angular-oauth2-oidc';
import { oAuthConfig } from './config/oauthConfig';
import { ODataConfiguration, ODataServiceFactory } from 'angular-odata-es5';
import { ODataConfigurationFactory } from './config/odataConfig';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultInterceptor } from './services/interceptor/default.interceptor';
import { AuthGuard } from './services/guard/auth.guard';
import { HttpLoading } from './services/injectable/httpLoading.service';
import { ODataQueryService } from './services/injectable/oDataQuery.service';
import { throwIfAlreadyLoaded } from './services/guard/module.import.guard';
import { OdataFilterFactory } from './services/injectable/oDataFilterFactory.service';
import { StartupService } from './services/injectable/startup.service';
import { SettingService } from './services/injectable/setting.service';


const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true,
  },
];

export function StartupServiceFactory(
  startupService: StartupService,
): Function {
  return () => startupService.load();
}

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ...APPINIT_PROVIDES,
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: AuthConfig, useValue: oAuthConfig },
    { provide: ODataConfiguration, useClass: ODataConfigurationFactory },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    { provide: HttpLoading, useClass: HttpLoading },
    AuthGuard,
    ODataQueryService,
    ODataServiceFactory,
    OdataFilterFactory,
    SettingService
  ],
})
/// CoreModule为服务定义模块 仅在AppModule模块中导入且仅允许导入一次
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}


