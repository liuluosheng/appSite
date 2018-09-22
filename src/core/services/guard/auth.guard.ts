import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: OAuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.authService.hasValidAccessToken()) {
            this.authService.redirectUri = state.url;
            this.router.navigateByUrl('/login');
        }
        return true;
    }
}
