import { BaseService } from '../BaseService';
import { Injectable } from '@angular/core';
import { ODataServiceFactory } from 'angular-odata-es5';

@Injectable()
export class DomainService<T> extends BaseService<T> {
    constructor(private odataService: ODataServiceFactory) {
        super(odataService);
    }
}
