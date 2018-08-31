import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/services/dto/User';


import { ODataQueryService } from '../../../../shared/services/injectable/ODataQueryService';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [ODataQueryService]
})
export class LoginComponent implements OnInit {
  schema = { properties: {} };
  model: any;
  validateForm: FormGroup;
  isSpinning = false;
  constructor(
    protected service: ODataQueryService<User>,
    private authService: OAuthService,
    private router: Router,
    private notification: NzNotificationService,
    private fb: FormBuilder) {
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
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

}
