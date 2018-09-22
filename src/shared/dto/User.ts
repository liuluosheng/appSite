import { EntityBase } from './EntityBase';

export interface User extends EntityBase {
    Name: string;
    Area: string;
    Position: string;
}
