import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { SysModule } from './sys/sys.module';
import { WmsModule } from './wms/wms.module';
import { OAuthModule, OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { oAuthConfig } from '../shared/config/oauthConfig';
import { ODataServiceFactory, ODataConfiguration } from 'angular-odata-es5';

import { DelonFormModule } from '@delon/form';
import { ODataConfigurationFactory } from '../shared/config/odataConfig';




registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgZorroAntdModule,
    WmsModule,
    SysModule,
    OAuthModule.forRoot(),
    DelonFormModule.forRoot()
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: ODataConfiguration, useClass: ODataConfigurationFactory },
    ODataServiceFactory],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(oAuthConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
  }
}
