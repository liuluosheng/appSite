import { Injectable } from '@angular/core';
import { Controls } from '../../../shared/const/controls.enum';
import { OdataOperard } from '../../../shared/const/odataOperard.enum';
import { format } from 'date-fns';
import { EntityBase } from '../../../shared/dto/EntityBase';
import { ODataQueryService } from './oDataQuery.service';
import { Observable } from 'rxjs';
import { ODataPagedResult } from 'angular-odata-es5';
import { Page } from '../../declare/page.class';
import { Schema } from '../../declare/schema.class';

@Injectable()
export class OdataFilterFactory {
    constructor(private service: ODataQueryService<EntityBase>) { }
    Create(schema: Schema): OdataFilterService<EntityBase> {
        return new OdataFilterService<EntityBase>(schema, this.service);
    }

}
class OdataFilterService<T extends EntityBase> {
    constructor(private schema: Schema, private service: ODataQueryService<T>) {
    }
    CreatePageData(page: Page, filterObj?: any): Observable<ODataPagedResult<T>> {
        if (Object.keys(filterObj).length !== 0) {
            page.filter = this.CreateFilterString(filterObj);
        }
        return this.service.init(this.schema.type).Page(page);
    }
    CreateFilterString(filterObj: any) {
        let filters = [];
        this.schema.properties.forEach((item) => {
            const value = filterObj[item.name];
            const min = filterObj[item.name + '_min'];
            const max = filterObj[item.name + '_max'];
            if (value != null || min != null || max != null) {
                switch (item.type) {
                    case Controls.Number:
                        if (min) {
                            filters = [...filters, `${item.name} ${OdataOperard.GreaterThanOrEqual} ${min}`];
                        }
                        if (max) {
                            filters = [...filters, `${item.name} ${OdataOperard.LessThanOrEqual} ${max}`];
                        }
                        break;
                    case Controls.DateTime:
                        if (value.length !== 0) {
                            filters = [...filters,
                            `${item.name} ${OdataOperard.GreaterThanOrEqual} ${format(value[0])}`,
                            `${item.name} ${OdataOperard.LessThanOrEqual} ${format(value[1])}`];
                        }
                        break;
                    case Controls.Select:
                        filters = [...filters, `${item.name} ${OdataOperard.Equals} '${value}'`];
                        break;
                    case Controls.Switch:
                    case Controls.Autocomplete:
                        filters = [...filters, `${item.name} ${OdataOperard.Equals} ${value}`];
                        break;
                    case Controls.Text:
                        filters = [...filters, `${OdataOperard.Contains}(${item.name}, '${value}')`];
                        break;
                    default:
                        break;
                }
            }
        });
        return filters.join(` ${OdataOperard.And} `);
    }
}
