import { IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';

export interface IapStateModel {
    packages: any[];
    products: IAPProduct[];
    purchased: any[];
    expired: any[];
    refunded: any[];
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
    alias: string;
    id: string;
    purchaseToken: string;
    purchaseTime: number;
    signature: string;
    type: string;
}

export type IapType = 'FREE_SUBSCRIPTION' | 'PAID_SUBSCRIPTION' | 'NON_RENEWING_SUBSCRIPTION' | 'CONSUMABLE' | 'NON_CONSUMABLE';
