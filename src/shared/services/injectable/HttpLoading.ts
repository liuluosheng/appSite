import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpLoading {
    private _value: boolean;
    constructor() {
        this._value = false;
    }
    get value(): boolean {
        return this._value;
    }
    set value(loading: boolean) {
        this._value = loading;
    }
}
