import { ODataServiceFactory, ODataService } from 'angular-odata-es5';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { first, switchMap } from 'rxjs/operators';
@Injectable()
export class ODataQueryService<T> {
    private odata: ODataService<T>;
    constructor(private oDataService: ODataServiceFactory) {

    }
    public init(type: string) {
        this.odata = this.oDataService.CreateService<T>(type);
    }
    public GetById(id: any): Observable<T> {
        return this.odata.Get(id).Exec().pipe(
            switchMap((v: any) => v.value),
            first<T>()
        );
    }

    public Create(item: T): Observable<T> {
        return this.odata.Post<T>(item);
    }
}