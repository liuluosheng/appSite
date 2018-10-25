import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingService } from './setting.service';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/// 应用启动前加载
@Injectable()
export class StartupService {
    constructor(
        private settingService: SettingService,
        private httpClient: HttpClient) {

    }
    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            zip(
                this.httpClient.get(`${environment.apiUrl}/systemmenu`)

            )
                .pipe(
                    // 接收其他拦截器后产生的异常消息
                    catchError(([langData, appData]) => {
                        resolve(null);
                        return [langData, appData];
                    }),
                )
                .subscribe(
                    ([menus]) => {
                        // 设置系统菜单数据
                        this.settingService.Menu = menus;
                    },
                    () => { },
                    () => {
                        resolve(null);
                    },
                );
        });
    }
}

