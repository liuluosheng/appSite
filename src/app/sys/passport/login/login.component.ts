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
  schema: any = {properties: {}};
  model: any;
  constructor(protected service: DomainService<User>, private http: HttpClient) {
  }
  getmodel() {
    this.service.GetById('c7a66a0b-15c6-4678-8fcb-24f79de0cac7').subscribe(
      s => {this.model = s; }
    );
  }
  ngOnInit() {
    this.service.init('users');
    this.http.get('http://localhost:8000/api/jsonschema/user')
      .subscribe((data: any) => {
        this.schema = data;
      });
  }

}
