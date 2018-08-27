import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(private router: Router, private notification: NzNotificationService) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpEvent<any>) => {
                if (error instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>error).status) {
                        case 401: // 未登录状态码
                            this.router.navigateByUrl('/login');
                            break;
                        default:
                            this.notification.error('ERROR', error.message);
                            break;
                    }
                }
                return of(error);
            })
        );
    }
}
