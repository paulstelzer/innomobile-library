export interface IAPPwaProductModel {
    id: string;
    alias: string;
    type: string;
    state?: string;
    title?: string;
    description?: string;
    priceMicros: number;
    price: string;
    currency: string;
    loaded?: boolean;
    valid?: boolean;
    canPurchase?: boolean;
    owned?: boolean;
    downloading?: boolean;
    downloaded?: boolean;
    additionalData?: any;
    transaction?: any;
}
