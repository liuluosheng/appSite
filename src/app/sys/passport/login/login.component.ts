import { Component, OnInit } from '@angular/core';
import { TestUser } from '../../../../shared/services/dto/user_dto';
import { HttpClient } from '@angular/common/http';
import { ODataQueryService } from '../../../../shared/services/injectable/ODataQueryService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [ODataQueryService]
})
export class LoginComponent implements OnInit {
  schema: any = { properties: {} };
  model: TestUser;
  constructor(protected service: ODataQueryService<TestUser>, private http: HttpClient) {
  }
  getmodel() {
    this.service.GetById('e20061e5-b518-491b-92bf-dfd86bf11c9f').subscribe(
      s => {
        this.model = s;
      }
    );
  }
  submit(value: TestUser) {
    this.service.Create(value).subscribe((re) => {

    });
  }
  ngOnInit() {
    this.service.init('users');
    this.http.get('http://localhost:8000/api/jsonschema/testuser')
      .subscribe((data: any) => {
        this.schema = data;
      });
  }

}
