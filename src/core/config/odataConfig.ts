import { HttpHeaders } from '@angular/common/http';
import { ODataConfiguration } from 'angular-odata-es5';
import { environment } from '../../environments/environment';

export class ODataConfigurationFactory {

    constructor() {
        const config = new ODataConfiguration();
        config.baseUrl = environment.oDataBaseUrl;

        // Set some new `postRequestOptions` here as an example
        config.postRequestOptions.headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
        });

        return config;
    }
}

