import { Inject, Injectable } from '@angular/core';
import { IAPProduct, IAPProductOptions, InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform } from '@ionic/angular';
import { Store } from '@ngxs/store';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import transform from 'lodash/transform';
import { IapPwaGenerator } from '../classes/iap-pwa-generator.class';
import { IAP_DEBUG, IAP_PACKAGES, IAP_PWA_PACKAGES, STRIPE_KEY } from '../classes/iap-token';
import {
    AddPackage,
    AddProduct,
    IapPurchaseApproved,
    IapPurchaseExpired,
    IapPurchaseRefunded,
    IapPurchaseVerified
} from '../store/iap.actions';
import { IapModel, IapPurchase, IapType } from '../store/iap.model';
import { IapState } from '../store/iap.state';

declare var Stripe: any;

@Injectable({
    providedIn: 'root'
})
export class IapService {
    isSupportedNative = true;
    private storePackages: IAPProductOptions[];

    stripe = null;

    constructor(
        public iapStore: InAppPurchase2,
        private store: Store,
        private platform: Platform,
        @Inject(IAP_PACKAGES) private packages: IapModel[],
        @Inject(IAP_PWA_PACKAGES) private pwaPackages: IapModel[],
        @Inject(IAP_DEBUG) private debug,
        @Inject(STRIPE_KEY) private stripeKey,
    ) {

    }

    init(validator = null) {
        this.storePackages = this.store.selectSnapshot(IapState.getPackages);

        if (this.platform.is('cordova')) {
            this.isSupportedNative = true;
            return this.initCordova(validator);
        }

        this.isSupportedNative = false;
        if (!this.pwaPackages || this.pwaPackages.length === 0) {
            return null;
        }

        if (this.stripeKey) {
            try {
                this.stripe = Stripe(this.stripeKey);
            } catch (error) {
                if (this.debug) {
                    console.log('[@innomobile/iap] Stripe is not available', error);
                }
            }
        }

        return this.initPwa();
    }

    finish(id: string) {
        if (!this.isSupportedNative) { return; }
        const product = this.get(id);
        if (product) {
            product.finish();
            return true;
        }
        return false;
    }

    refresh() {
        if (!this.isSupportedNative) { return; }
        // Refresh is important after register IAPs
        this.iapStore.refresh();
    }

    get(id: string) {
        if (!this.isSupportedNative) { return; }
        try {
            const product = this.iapStore.get(id);
            return product;
        } catch (err) {
            console.log('[@innomobile/iap] Error Loading IAP ' + err);
            return null;
        }
    }

    purchase(id: string) {
        if (!this.isSupportedNative) {
            return;
        }

        /* Only configuring purchase when you want to buy,
         * because when you configure a purchase -
         * It prompts the user to input their apple id info on config which is annoying
         */
        try {
            return this.iapStore.order(id);
        } catch (err) {
            console.log('[@innomobile/iap] Error Ordering IAP ', err);
        }
    }

    private initCordova(validator) {
        // Debug everything
        if (this.debug) {
            this.iapStore.verbosity = this.iapStore.DEBUG;
        }

        if (validator) {
            this.iapStore.validator = validator;
        } else {
            this.iapStore.validator = (product: any, callback) => {
                callback(true, {});
            };
        }

        for (const iapPackage of this.packages) {
            const p: IAPProductOptions = {
                id: '',
                alias: '',
                type: ''
            };
            if (this.platform.is('ios')) {
                if (!iapPackage.itunesId) { return; }
                p.id = iapPackage.itunesId;
                p.alias = iapPackage.id;
                p.type = this.getIapType(iapPackage.itunesType);
            } else if (this.platform.is('android')) {
                if (!iapPackage.playstoreId) { return; }
                p.id = iapPackage.playstoreId;
                p.alias = iapPackage.id;
                p.type = this.getIapType(iapPackage.playstoreType);
            } else {
                return;
            }

            this.registerPackage(p);
        }

        if (this.debug) {
            // Overall Store Error
            this.iapStore.error((error) => {
                console.log('[@innomobile/iap] Store Error ', error);
            });
        }

        this.refresh();

        this.iapStore.ready(() => {
            if (this.debug) {
                console.log('[@innomobile/iap] IAP Store is ready');
            }
        });
    }

    private initPwa() {
        const iaps = new IapPwaGenerator(this.pwaPackages);
        for (const p of iaps.getProducts()) {
            this.addProduct(p);
        }
    }

    private addProduct(product: IAPProduct) {
        if (this.debug) {
            console.log('[@innomobile/iap] Add Product', product);
        }
        this.store.dispatch(new AddProduct(product));
    }

    private addPackage(p: IAPProductOptions) {
        const index = this.findIndex(p.id, this.storePackages);
        if (index >= 0) {
            const changes = this.getDifferenceBetweenObjects(this.storePackages[index], p);
            if (Object.keys(changes).length === 0) { return; }
        }

        this.store.dispatch(new AddPackage(p));
    }

    private findIndex(id, arr: any[]) {
        return arr.findIndex(ele => ele.id === id);
    }

    private registerPackage(p: IAPProductOptions) {
        this.iapStore.register(p);
        this.registerHandlers(p.id);
        this.addPackage(p);
    }

    private getIapType(input: IapType): string {
        if (input) {
            switch (input) {
                case 'FREE_SUBSCRIPTION': return this.iapStore.FREE_SUBSCRIPTION;
                case 'PAID_SUBSCRIPTION': return this.iapStore.PAID_SUBSCRIPTION;
                case 'NON_RENEWING_SUBSCRIPTION': return this.iapStore.NON_RENEWING_SUBSCRIPTION;
                case 'CONSUMABLE': return this.iapStore.CONSUMABLE;
                case 'NON_CONSUMABLE': return this.iapStore.NON_CONSUMABLE;
            }
        }
        return this.iapStore.NON_CONSUMABLE;
    }

    private registerHandlers(id: string) {
        this.iapStore.when(id).refunded((product: IAPProduct) => {
            this.store.dispatch(new IapPurchaseRefunded(product));
        });

        this.iapStore.when(id).expired((product: IAPProduct) => {
            this.store.dispatch(new IapPurchaseExpired(product));
        });

        this.iapStore.when(id).verified((product: IAPProduct) => {
            let purchaseTime = new Date().getTime();
            let purchaseToken = '';
            let signature = '';
            if (product.transaction) {
                if (product.transaction.type === 'ios-appstore') {
                    purchaseToken = product.transaction.appStoreReceipt;
                    signature = product.transaction.transactionReceipt;
                } else if (product.transaction.type === 'android-playstore') {
                    if (product.transaction.receipt) {
                        const obj = JSON.parse(product.transaction.receipt);
                        purchaseTime = (obj && obj.purchaseTime) ? obj.purchaseTime : new Date().getTime();
                    }
                    purchaseToken = product.transaction.purchaseToken;
                    signature = product.transaction.signature;
                }
            }

            const purchase: IapPurchase = {
                productId: product.id,
                alias: product.alias,
                id: product.transaction.id,
                purchaseToken,
                purchaseTime,
                signature,
                type: product.transaction.type,
                data: null
            };

            if (purchase.type === 'android-playstore') {
                const check: string = purchase.id;
                if (!check.startsWith('GPA.')) {
                    // This must be a fake buy
                    purchase.data = {
                        fake: true
                    };
                }
            }
            this.store.dispatch(new IapPurchaseVerified(purchase, product));
        });

        this.iapStore.when(id).approved((product: IAPProduct) => {
            this.store.dispatch(new IapPurchaseApproved(product));
            product.verify();
        });

        this.iapStore.when(id).updated((product: IAPProduct) => {
            this.addProduct(product);
        });
    }

    /**
     * Deep diff between two object, using lodash
     * @param  object Object compared
     * @param  base   Object to compare with
     * @return         Return a new object who represent the diff
     */
    private getDifferenceBetweenObjects(obj1, obj2) {
        const changes = (object, base) => {
            return transform(object, (result, value, key) => {
                if (!isEqual(value, base[key])) {
                    result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
                }
            });
        };
        return changes(obj1, obj2);
    }
}
