import { Component } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { oAuthConfig } from 'src/core/config/oauthConfig';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(oAuthConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
  }
}
