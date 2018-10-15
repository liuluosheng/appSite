import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { SysModule } from './sys/sys.module';
import { WmsModule } from './wms/wms.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';
import { CoreModule } from '../core/core.module';

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
    CoreModule,
    WmsModule,
    SysModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.apiUrl, environment.oDataBaseUrl],
        sendAccessToken: true
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
