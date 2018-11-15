
import { IapPurchase } from './iap.model';
import { IAPProductOptions, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';

export class IapInit {
    static readonly type = '[IAP] Init';
}

export class IapClear {
    static readonly type = '[IAP] Clear everything';
}

export class IapClearUser {
    static readonly type = '[IAP] Clear user';
}

export class AddPackage {
    static readonly type = '[IAP] Add Package';
    constructor(public iap: IAPProductOptions) {}
}

export class AddProduct {
    static readonly type = '[IAP] Add / Update Product';
    constructor(public product: IAPProduct) {}
}

export class IapPurchaseApproved {
    static readonly type = '[IAP] Purchase approved';
    constructor(public product: IapPurchase) {}
}

export class IapPurchaseRefunded {
    static readonly type = '[IAP] Purchase refunded';
    constructor(public product: any) {}
}

export class IapPurchaseExpired {
    static readonly type = '[IAP] Purchase expired';
    constructor(public product: any) {}
}

export class IapPurchaseVerified {
    static readonly type = '[IAP] Purchase verified';
    constructor(public product: any) {}
}


