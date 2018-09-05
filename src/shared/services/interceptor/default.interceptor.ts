import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse,
    HttpParams, HttpUrlEncodingCodec,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';


@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(private router: Router, private notification: NzNotificationService) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const cloneReq: any = {
            headers: req.headers.set('Access-Control-Allow-Origin', '*')
        };
        const filter = req.params.get('$filter');
        if (filter != null) {
            cloneReq.params = new HttpParams({ encoder: new OdataFilterHttpUrlEncodingCodec() });
            req.params.keys().forEach((value) => {
                cloneReq.params = cloneReq.params.set(value, req.params.get(value).replace(/\+/g, '%2B'));
            });
        }

        const currentReq = req.clone(cloneReq);
        return next.handle(currentReq).pipe(
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

// OData Filter时，时间格式中的+号重复编码的问题
class OdataFilterHttpUrlEncodingCodec extends HttpUrlEncodingCodec {
    constructor() { super(); }
    encodeKey(key): string { return encodeURIComponent(key); }
    encodeValue(value): string { return value; }
    decodeKey(key): string { return decodeURIComponent(key); }
    decodeValue(value): string { return decodeURIComponent(value); }
}
