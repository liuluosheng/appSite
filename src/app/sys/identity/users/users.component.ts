import { Component, OnInit } from '@angular/core';
import { ODataQueryService } from '../../../../shared/services/injectable/ODataQueryService';
import { TestUser } from '../../../../shared/services/dto/user_dto';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  dataSet: any[];
  pageindex = 1;
  pagesize = 10;
  total: number;
  constructor(
    protected service: ODataQueryService<TestUser>,
  ) { }
  getpage(pageindex: number, pagesize: number) {
    this.service.Page(pageindex, pagesize, 'Name').subscribe((o) => {
      this.dataSet = o.data;
      this.total = o.count;
    });
  }
  ngOnInit() {
    this.service.init('users');
    this.getpage(this.pageindex, this.pagesize);
  }

}
