import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { findIndex } from 'rxjs/operators';
import { from } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { oAuthConfig } from '../../../../core/config/oauthConfig';
import { SystemMenu } from 'src/shared/dto/SystemMenu';
@Component({
  selector: 'app-layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultLayoutComponent implements OnInit {

  constructor(
    protected router: Router,
    private authService: OAuthService,
    protected route: ActivatedRoute) {
  }
  isCollapsed = false;
  triggerTemplate = null;
  tabs: any[] = [];
  tabSelectIndex = 0;
  menus: any[] = [{Url: '/404', Name: '404'}];
  @ViewChild('trigger') customTrigger: TemplateRef<void>;
  navigate(url): void {
    this.router.navigate([url]);
  }
  selected(url): boolean {
    return url === this.router.url;
  }
  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }
  closeTab(index, tab): void {
    this.tabs.splice(index, 1);
    if (this.router.url === tab.url) {
      if (this.tabs.length === 0) {
        this.router.navigateByUrl('/');
        this.tabs.push({ title: this.route.firstChild.snapshot.data.title, url: this.router.url });
      } else {
        this.router.navigateByUrl(this.tabs[this.tabs.length - 1].url);
      }
    }
  }
  logout(): void {
    this.authService.logOut();
    this.router.navigateByUrl(oAuthConfig.logoutUrl);
  }
  ngOnInit() {
    /// tab页的绑定
    this.tabs = [...this.tabs, { title: this.route.firstChild.snapshot.data.title, url: this.router.url }];
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const i = this.tabs.findIndex((n) => n.url === event.url);
        if (i === -1) {
          this.tabs = [...this.tabs, { title: this.route.firstChild.snapshot.data.title, url: event.url }];
          this.tabSelectIndex = this.tabs.length;
        } else {
          this.tabSelectIndex = i;
        }
      }
    });
  }

}
