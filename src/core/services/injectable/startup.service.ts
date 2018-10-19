import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class StartupService {
    constructor(private httpClient: HttpClient) {

    }
    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        const ret = this.httpClient
                    .get('./assets/app-data.json')
                    .toPromise()
                    .then((res: any) => {
                        // just only injector way if you need navigate to login page.
                        // this.injector.get(Router).navigate([ '/login' ]);

                    })
                    .catch((err: any) => {
                        return Promise.resolve(null);
                    });

        return ret.then((res) => { });
    }
}
