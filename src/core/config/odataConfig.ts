import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ODataConfiguration } from 'angular-odata-es5';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiOdataConfig extends ODataConfiguration {
    baseUrl = environment.oDataBaseUrl;
    defaultRequestOptions = this.customRequestOptions;
}

