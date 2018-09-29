import { Injectable } from '@angular/core';
import { Controls } from '../../../shared/const/controls.enum';

@Injectable()
export class OdataFilterFactory {
    constructor() { }
    Create(schema: any[]): OdataFilterService {
        return new OdataFilterService(schema);
    }

}
class OdataFilterService {
    constructor(private schema: any[]) {
    }
    CreateFilterString(object: any) {
        this.schema.forEach((item) => {
            const type = <Controls>item.type;
            switch (type) {
                case Controls.DateTime:

                    break;
                case Controls.Select:

                    break;
                case Controls.String:
                default:
                    break;
            }
        });
    }
}
