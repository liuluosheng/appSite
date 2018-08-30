import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ODataQueryService } from '../../../../shared/services/injectable/ODataQueryService';
import { TestUser } from '../../../../shared/services/dto/user_dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { SFComponent } from '@delon/form';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  dataSet: any[];
  schema = { properties: {} };
  schemaType = 'testuser';
  pageindex = 1;
  pagesize = 10;
  total: number;
  @ViewChild(SFComponent)
  private sf: SFComponent;
  constructor(
    protected service: ODataQueryService<TestUser>,
    private http: HttpClient,
    private modalService: NzModalService,
    private notification: NzNotificationService,
  ) { }
  create(tplContent: TemplateRef<{}>) {
    this.modalService.create({
      nzTitle: '新建',
      nzContent: tplContent,
      nzOnOk: () => {
        this.sf.validator();
        if (this.sf.valid) {
         this.service.Create(this.sf.value).subscribe((data) => {
         this.dataSet = [data, ...this.dataSet];
         });
        } else {
          this.sf.refreshSchema();
          this.notification.error('Error', '数据检验失败！');
          return false;
        }

      }
    });
  }
  getpage(pageindex: number, pagesize: number) {
    this.service.Page(pageindex, pagesize, 'Name').subscribe((o) => {
      this.dataSet = o.data;
      this.total = o.count;
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
