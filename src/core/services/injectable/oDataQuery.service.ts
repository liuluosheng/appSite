import { ODataServiceFactory, ODataService, ODataPagedResult } from 'angular-odata-es5';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { first, switchMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EntityBase } from 'src/shared/dto/EntityBase';

@Injectable()
export class ODataQueryService<T extends EntityBase> {
    private odata: ODataService<T>;
    constructor(private oDataService: ODataServiceFactory) {
    }
    public init(type: string): QueryService<T> {
        this.odata = this.oDataService.CreateService<T>(type);
        return new QueryService<T>(this.odata);
    }
}

class QueryService<T extends EntityBase> {
    constructor(private odata: ODataService<T>) {
    }
    public GetById(id: any): Observable<T> {
        return this.odata.Get(id).Exec().pipe(
            switchMap((v: any) => v.value),
            first<T>()
        );
    }
    public Page(pageindex: number, pagesize: number, orderby: string, filter?: string): Observable<ODataPagedResult<T>> {
        return this.odata.Query()
            .Skip((pageindex - 1) * pagesize)
            .Filter(filter)
            .Top(pagesize)
            .OrderBy(orderby)
            .ExecWithCount();
    }
    public Create(item: T): Observable<T> {
        return this.odata.Post(item);
    }
    public Update(item: T): Observable<T> {
        return this.odata.Put<T>(item, item.Id);
    }
    public Delete(key: any): Observable<HttpResponse<T>> {
        return this.odata.Delete(key);
    }
    public UpdateByPatch(entity: any, key: any): Observable<HttpResponse<T>> {
        return this.odata.Patch(entity, key);
    }
    public Query(filter?: string, top?: number) {
        return this.odata.Query().Filter(filter).Top(top).Exec();
    }
}
