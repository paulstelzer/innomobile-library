export interface IapModel {
    id: string;
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
