import { IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { IAPProductClass } from './iap-product.class';

export class IapPwaGenerator {
    products: IAPProduct[] = [];
    iapDefaults: any[] = [];

    constructor(iapDefaults: any) {
        this.iapDefaults = iapDefaults;
        this.createProducts();
    }

    getProducts() {
        return this.products;
    }

    private createProducts(): IAPProduct[] {
        this.products = [];
        for (const p of this.iapDefaults) {
            const cl = new IAPProductClass(p);
            this.products.push(cl);
        }
        return this.products;
    }
}
