import { Component, OnInit } from '@angular/core';
import { DomainService } from '../../../../shared/services/injectable/DomainService';
import { User } from '../../../../shared/services/dto/user_dto';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [DomainService]
})
export class LoginComponent implements OnInit {
  schema: any = {properties: {}};
  model: any;
  validateForm: FormGroup;
  isSpinning = false;
  constructor(protected service: DomainService<User>,
    private http: HttpClient,
    private authService: OAuthService,
    private router: Router,
    private notification: NzNotificationService,
    private fb: FormBuilder) {
  }
  getmodel() {
    this.service.GetById('c7a66a0b-15c6-4678-8fcb-24f79de0cac7').subscribe(
      s => {this.model = s; }
    );
  }
  submitForm(): void {
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    if (this.validateForm.valid) {
      this.isSpinning = true;
      this.authService.fetchTokenUsingPasswordFlowAndLoadUserProfile(
        this.validateForm.get('userName').value,
        this.validateForm.get('password').value).then((re) => {
          this.router.navigate(['/']);
          this.isSpinning = false;
        }).catch(() => {
          this.isSpinning = false;
          this.notification.error('Error', '登录失败，密码输错了吧！');
        });
    }
  }
  ngOnInit() {
    this.service.init('users');
    this.http.get('http://localhost:8000/api/jsonschema/user')
      .subscribe((data: any) => {
        this.schema = data;
      });
      this.validateForm = this.fb.group({
        userName: [ null, [ Validators.required ] ],
        password: [ null, [ Validators.required ] ]
      });
  }

}
