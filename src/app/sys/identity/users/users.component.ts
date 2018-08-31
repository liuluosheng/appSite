import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ODataQueryService } from '../../../../shared/services/injectable/ODataQueryService';
import { User } from '../../../../shared/services/dto/User';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { SFComponent } from '@delon/form';
import { compare } from 'fast-json-patch';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  loading = true;
  dataSet: any[];
  updateItem: any;
  schema = { properties: {} };
  schemaType = 'user';
  pageindex = 1;
  pagesize = 10;
  total: number;
  @ViewChild(SFComponent)
  private sf: SFComponent;
  constructor(
    protected service: ODataQueryService<User>,
    private http: HttpClient,
    private modalService: NzModalService,
    private notification: NzNotificationService,
  ) { }


  modal(tplContent: TemplateRef<{}>, item: User, title: string, rowIndex: number) {
    this.modalService.create({
      nzTitle: title,
      nzContent: tplContent,
      nzOnOk: () => {
        this.sf.validator();
        if (this.sf.valid) {
          this.loading = true;
          if (item == null) {
            this.service.Create(this.sf.value).subscribe((data) => {
              this.dataSet = [data, ...this.dataSet];
              this.loading = false;
            });
          } else {
            this.service.UpdateByPatch(compare(item, this.sf.value), item.Id).subscribe((data) => {
             this.dataSet[rowIndex] = data.body;
             this.loading = false;
            });
          }

        } else {
          this.notification.error('Error', '数据检验失败！');
          return false;
        }

      }
    });
  }
  getpage(pageindex: number, pagesize: number) {
    this.loading = true;
    this.service.Page(pageindex, pagesize, 'Name').subscribe((o) => {
      this.dataSet = o.data;
      this.total = o.count;
      this.loading = false;
    });
  }
  ngOnInit() {
    this.service.init('users');
    this.http.get(`${environment.jsonSchemaUrl}/${this.schemaType}`)
      .subscribe((data: any) => {
        this.schema = data;
      });
    this.getpage(this.pageindex, this.pagesize);
  }

}
