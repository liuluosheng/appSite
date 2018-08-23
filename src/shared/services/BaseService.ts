import { ODataServiceFactory, ODataService } from 'angular-odata-es5';
import { Observable } from 'rxjs';

export abstract class BaseService<T> {
    private odata: ODataService<T>;
    constructor(private oDataService: ODataServiceFactory ) {

    }
    public init(type: string) {
        this.odata = this.oDataService.CreateService<T>(type);
    }
    public GetById(id: any): Observable<T> {
        return this.odata.Get(id).Exec();
    }

    public Create(item: T): Observable<T> {
        return this.odata.Post<T>(item);
    }
}
