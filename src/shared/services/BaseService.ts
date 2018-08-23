import { ODataServiceFactory, ODataService } from 'angular-odata-es5';
import { Observable } from 'rxjs';
import { Injector } from '@angular/core';

export abstract class BaseService<T> {
    private odata: ODataService<T>;
    private injector: Injector;

    public init(type: string) {
        this.odata = this.injector.get(ODataServiceFactory).CreateService<T>(type);
    }
    public GetById(id: any): Observable<T> {
        return this.odata.Get(id).Exec();
    }

    public Create(item: T): Observable<T> {
        return this.odata.Post<T>(item);
    }
}
