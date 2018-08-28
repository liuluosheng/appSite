import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { findIndex } from 'rxjs/operators';
import { from } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { oAuthConfig } from '../../../../shared/config/oauthConfig';
@Component({
  selector: 'app-layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultLayoutComponent implements OnInit {

  constructor(protected router: Router,
    private authService: OAuthService,
    protected route: ActivatedRoute) {
  }
  isCollapsed = false;
  triggerTemplate = null;
  tabs: any[] = [];
  selectedUrl: string;
  tabSelectIndex = 0;
  @ViewChild('trigger') customTrigger: TemplateRef<void>;
  navigate(url): void {
    this.router.navigate([url]);
  }
  selected(url): boolean {
    return url === this.selectedUrl;
  }
  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }
  logout(): void {
    this.authService.logOut();
    this.router.navigateByUrl(oAuthConfig.logoutUrl);
  }
  ngOnInit() {
    /// tab页的绑定
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.selectedUrl = event.url;
        from(this.tabs).pipe(
          findIndex((o: any) => o.url === event.url)
        ).subscribe((x) => {
          if (x === -1) {
            this.tabs.push({ title: this.route.firstChild.snapshot.data.title, url: event.url });
            this.tabSelectIndex = this.tabs.length;
          } else {
            this.tabSelectIndex = x;
          }
        });
      }
    });
  }

}
