import { IAPProductOptions, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { IapPurchase } from './iap.model';

export class IapInit {
    static readonly type = '[IAP] Init';
}

export class IapClear {
    static readonly type = '[IAP] Clear everything';
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
