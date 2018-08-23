export interface User {
    UserName: string;
    PassWord: string;
    Email: string;
    PhoneNumber: string;
    Area: string;
    Age: number;
    CreateDate: string;
    UserColor: Color;
}

export enum Color {
    Green = 0,
    Red = 1,
    Yellow = 2,
}
