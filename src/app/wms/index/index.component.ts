import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { findIndex } from 'rxjs/operators';
import { from } from 'rxjs';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

  constructor(protected router: Router, protected route: ActivatedRoute) {
    /// tab页的绑定
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.selectedUrl = event.url;
        from(this.tabs).pipe(
          findIndex((o: any) => o.url === event.url)
        ).subscribe((x) => {
          if (x === -1) {
            this.tabs.push({ title: route.firstChild.snapshot.data.title, url: event.url });
            this.tabSelectIndex = this.tabs.length;
          } else {
            this.tabSelectIndex = x;
          }
        });
      }
    });
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
  ngOnInit() {

  }

}
