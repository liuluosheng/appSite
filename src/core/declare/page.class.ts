export class Page {
    pageSize = 10;
    pageIndex = 1;
    total: number;
    orderBy = 'CreatedDate desc';
    filter?: string;
    expand?: string;
}
