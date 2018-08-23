import { Component, OnInit } from '@angular/core';
import { DomainService } from '../../../../shared/services/injectable/DomainService';
import { User } from '../../../../shared/services/dto/user_dto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [DomainService]
})
export class LoginComponent implements OnInit {
  schema: any = {};
  constructor(protected service: DomainService<User>, http: HttpClient) {
    service.init('User');
    http.get('http://localhost:8000/api/jsonschema/user')
      .subscribe((data: any) => {
        this.schema = data;
      });
  }

  ngOnInit() {
  }

}
