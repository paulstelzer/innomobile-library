import { Injectable, Inject, Optional } from '@angular/core';
import { IapModule } from '../iap.module';

import { Platform } from '@ionic/angular';

import { InAppPurchase2, IAPProduct, IAPProductOptions } from '@ionic-native/in-app-purchase-2/ngx';
import { IapModel, IapType, IapPurchase } from '../store/iap.model';

import { Store } from '@ngxs/store';
import { IapPurchaseApproved, AddPackage, AddProduct } from '../store/iap.actions';


@Injectable({
    providedIn: IapModule
})
export class IapService {
    private initialized = false;

    constructor(
        public iapStore: InAppPurchase2,
        private store: Store,
        private platform: Platform,
        @Inject('iapPackages') private packages: IapModel[],
        @Optional() @Inject('iapDebug') private debug
    ) {

    }

    init() {
        // If not Cordova, return
        if (!this.platform.is('cordova')) { return; }

        this.initialized = true;
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

    registerPackage(p: IAPProductOptions) {
        this.iapStore.register(p);
        this.registerHandlers(p.id);
        this.store.dispatch(new AddPackage(p));
    }

    finish(id: string) {
        const product = this.get(id);
        if (product) {
            product.finish();
            return true;
        }
        return false;
    }

    refresh() {
        // Refresh is important after register IAPs
        this.iapStore.refresh();
    }

    get(id: string) {
        if (!this.initialized) { return null; }

        try {
            const product = this.iapStore.get(id);
            return product;
        } catch (err) {
            console.log('[@innomobile/iap] Error Loading IAP ' + err);
            return null;
        }
    }

    purchase(id: string) {
        /* Only configuring purchase when you want to buy,
         * because when you configure a purchase -
         * It prompts the user to input their apple id info on config which is annoying
         */
        if (!this.initialized) { return; }

        try {
            this.iapStore.order(id);
        } catch (err) {
            console.log('[@innomobile/iap] Error Ordering IAP ', err);
        }
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
        // Handlers
        /*
        this.iapStore.when(id).refunded((product: IAPProduct) => {
            console.log('IAP refunded', product)
        });

        this.iapStore.when(id).expired((product: IAPProduct) => {
            console.log('IAP expired', product)
        });*/

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
            // console.log('Updated', product);
            this.store.dispatch(new AddProduct(product));
        });
    }
}
