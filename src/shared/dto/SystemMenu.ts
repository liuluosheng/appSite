import { EntityBase } from './EntityBase';

export interface SystemMenu extends EntityBase {
    Name: string;
    Root: boolean;
    Url: string;
    Description: string;
    ParentMenuId: any;
    Icon: string;
    Items: Array<SystemMenu>;
}
