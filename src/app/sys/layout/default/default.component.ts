import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { oAuthConfig } from '../../../../core/config/oauthConfig';
import { SystemMenu } from 'src/shared/dto/SystemMenu';
import { HttpClient } from '@angular/common/http';
import { SettingService } from 'src/core/services/injectable/setting.service';
@Component({
  selector: 'app-layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultLayoutComponent implements OnInit {

  constructor(
    protected router: Router,
    private settingService: SettingService,
    private httpClient: HttpClient,
    private authService: OAuthService,
    protected route: ActivatedRoute) {
  }
  isCollapsed = false;
  triggerTemplate = null;
  tabs: any[] = [];
  tabSelectIndex = 0;
  menus: any[];
  selectedMenu?: SystemMenu;

  navigate(url) {
    this.router.navigateByUrl(url);
  }
  selected(url): boolean {
    return url === this.router.url;
  }
  select(menu) {
    this.selectedMenu = menu;
  }
  closeTab(index, tab): void {
    this.tabs.splice(index, 1);
    if (this.router.url === tab.url) {
      if (this.tabs.length === 0) {
        this.router.navigateByUrl('/');
       this.tabs.push({ title: 'welcome', url: '/' });
      } else {
        this.router.navigateByUrl(this.tabs[this.tabs.length - 1].url);
      }
    }
  }
  logout(): void {
    this.authService.logOut();
    this.router.navigateByUrl(oAuthConfig.logoutUrl);
  }
  findCurrentMenu(menus: SystemMenu[]) {
    menus.forEach((v) => {
      if (v.Url === this.router.url) {
        this.selectedMenu = v;
      }
      if (this.selectedMenu == null) {
        this.findCurrentMenu(v.Items);
      }
    });
  }

  ngOnInit() {
    // 菜单数据
    this.menus = this.settingService.Menu;
    this.findCurrentMenu(this.menus);
    if (this.selectedMenu != null) {
      this.tabs = [...this.tabs, { title: this.selectedMenu.Name, url: this.selectedMenu.Url }];
    } else {
      this.tabs = [...this.tabs, { title: 'welcome', url: '/' }];
    }
    /// tab页的绑定
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const i = this.tabs.findIndex((n) => n.url === event.url);
        if (i === -1) {
          this.tabs = [...this.tabs, { title: this.selectedMenu.Name, url: event.url }];
          this.tabSelectIndex = this.tabs.length;
        } else {
          this.tabSelectIndex = i;
        }
      }
    });
  }

}
