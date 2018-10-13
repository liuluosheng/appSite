import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

export const oAuthConfig: AuthConfig = {

    // Url of the Identity Provider
    issuer: environment.identityServer,
    tokenEndpoint: `${environment.identityServer}/connect/token`,
    userinfoEndpoint: `${environment.identityServer}/connect/userinfo`,
    // URL of the SPA to redirect the user to after login
    redirectUri: '',
    logoutUrl: '/login',
    loginUrl: '/login',
    oidc: false,
    // The SPA's id. The SPA is registerd with this id at the auth-server
    clientId: 'ro.client',
    // set the scope for the permissions the client should request
    // The first three are defined by OIDC. The 4th is a usecase-specific one
    scope: 'openid profile api',
    dummyClientSecret: 'secret'
};
