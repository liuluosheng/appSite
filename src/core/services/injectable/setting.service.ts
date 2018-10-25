import { Injectable } from '@angular/core';
import { SystemMenu } from 'src/shared/dto/SystemMenu';

// 系统全局参数设定
@Injectable({ providedIn: 'root' })
export class SettingService {
    private _menu: SystemMenu[];
    constructor() {

    }
    /// 系统菜单数据
    set Menu(value: SystemMenu[]) {
        this._menu = value;
    }
    get Menu(): SystemMenu[] {
        return this._menu;
    }
}
