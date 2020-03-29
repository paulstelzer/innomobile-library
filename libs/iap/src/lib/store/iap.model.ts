import { IAPProduct, IAPProductOptions } from '@innomobile-native/plugins';

export interface IapStateModel {
    packages: IAPProductOptions[];
    products: IAPProduct[];
    purchased: any[];
}

export interface IapModel {
    id: string;
    name?: string;
    itunesId?: string;
    itunesType?: IapType;
    playstoreId?: string;
    playstoreType?: IapType;
}

export interface IapPurchase {
    productId: string;
    alias: string;
    id: string;
    purchaseToken: string;
    purchaseTime: number;
    signature: string;
    type: string;
    data?: any;
}

export type IapType = 'FREE_SUBSCRIPTION' | 'PAID_SUBSCRIPTION' | 'NON_RENEWING_SUBSCRIPTION' | 'CONSUMABLE' | 'NON_CONSUMABLE';
