import { Inject, Injectable } from '@angular/core';
import { IAPProduct, IAPProductOptions, InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { isEqual, isObject, transform } from 'lodash';
import { IapPwaGenerator } from '../classes/iap-pwa-generator.class';
import { IAP_DEBUG, IAP_PACKAGES, IAP_PWA_PACKAGES, STRIPE_KEY } from '../classes/iap-token';
import { AddPackage, AddProduct, IapPurchaseApproved, IapPurchaseExpired, IapPurchaseRefunded } from '../store/iap.actions';
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

    init() {
        this.storePackages = this.store.selectSnapshot(IapState.getPackages);

        if (this.platform.is('cordova')) {
            if (this.platform.is('ios') || this.platform.is('android')) {
                this.isSupportedNative = true;
                return this.initCordova();
            }
        }

        if (this.stripeKey) {
            this.stripe = Stripe(this.stripeKey);
        }

        this.isSupportedNative = false;
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

    private initCordova() {
        // Debug everything
        if (this.debug) {
            this.iapStore.verbosity = this.iapStore.DEBUG;
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

        // Overall Store Error
        this.iapStore.error((error) => {
            console.log('[@innomobile/iap] Store Error ', error);
        });

        this.refresh();

        this.iapStore.ready(() => {
            console.log('[@innomobile/iap]  IAP Store is ready');
        });
    }

    private initPwa() {
        const iaps = new IapPwaGenerator(this.pwaPackages);
        for (const p of iaps.getProducts()) {
            this.addProduct(p);
        }
    }

    private addProduct(product: IAPProduct) {
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
        // TODO Refunded / Expired --> Remove packages

        this.iapStore.when(id).refunded((product: IAPProduct) => {
            this.store.dispatch(new IapPurchaseRefunded(product));
        });

        this.iapStore.when(id).expired((product: IAPProduct) => {
            this.store.dispatch(new IapPurchaseExpired(product));
        });

        this.iapStore.when(id).approved((product: IAPProduct) => {
            const obj = JSON.parse(product.transaction.receipt);
            const purchaseTime = (obj && obj.purchaseTime) ? obj.purchaseTime : 0;

            const p: IapPurchase = {
                alias: product.alias,
                id: product.transaction.id,
                purchaseToken: product.transaction.purchaseToken,
                purchaseTime: purchaseTime,
                signature: product.transaction.signature,
                type: product.transaction.type
            };
            this.store.dispatch(new IapPurchaseApproved(p));
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
