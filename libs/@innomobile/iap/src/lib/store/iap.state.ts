import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';


import { IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { AddPackage, IapInit, IapPurchaseApproved, AddProduct, IapClear } from './iap.actions';


// Section 2
export interface IapStateModel {
    packages: any[];
    products: IAPProduct[];
    purchased: any[];
}

// Section 3
@State<IapStateModel>({
    name: 'iap',
    defaults: {
        packages: [],
        products: [],
        purchased: []
    }
})
export class IapState implements NgxsOnInit {

    @Selector()
    static getProducts(state: IapStateModel) {
        return state.products;
    }

    @Selector()
    static purchasedItems(state: IapStateModel) {
        return state.purchased;
    }

    constructor() {}

    /**
     * Dispatch CheckSession on start
     */
    ngxsOnInit(ctx: StateContext<IapStateModel>) {
        ctx.dispatch(new IapInit());

    }

    @Action(IapInit)
    iapInit(ctx: StateContext<IapStateModel>) {
        if (!ctx.getState()) {
            ctx.setState({
                packages: [],
                products: [],
                purchased: []
            });
        } else {
            ctx.patchState({
                packages: [],
                products: []
            });
        }
    }

    @Action(IapClear)
    iapClear(ctx: StateContext<IapStateModel>) {
        ctx.setState({
            packages: [],
            products: [],
            purchased: []
        });
    }

    @Action(IapPurchaseApproved)
    purchaseApproved(ctx: StateContext<IapStateModel>, action: IapPurchaseApproved) {
        const purchased = ctx.getState().purchased;

        const index = this.getPurchase(purchased, action.product.id);
        if (index < 0) {
            purchased.push(action.product);

            ctx.patchState({
                purchased: purchased
            });
        } else {
            console.log('Already included');
        }

    }

    @Action(AddPackage)
    addPackage(ctx: StateContext<IapStateModel>, action: AddPackage) {
        const packages = ctx.getState().packages;

        let included = false;

        packages.forEach(p => {
            if (p.alias === action.iap.alias) {
                included = true;
                return;
            }
        });

        if (!included) {
            packages.push(action.iap);
            ctx.patchState({
                packages: packages
            });
        }
    }

    @Action(AddProduct)
    addProduct(ctx: StateContext<IapStateModel>, action: AddProduct) {
        const products = ctx.getState().products;
        const index = this.getIndex(products, action.product.alias);

        if (index >= 0) {
            products[index] = action.product;

        } else {
            products.push(action.product);
        }

        ctx.patchState({
            products: products
        });
    }

    private getIndex(products: any[], value: string) {
        let index = 0;
        if (products.length > 0) {
            for (let i = 0; i < products.length; i++) {
                if (products[index].alias === value) {
                    return index;
                }
                index++;
            }

        }
        return -1;
    }

    private getPurchase(purchases: any[], value: string) {
        let index = 0;
        if (purchases.length > 0) {
            for (let i = 0; i < purchases.length; i++) {
                if (purchases[index].id === value) {
                    return index;
                }
                index++;
            }

        }
        return -1;
    }
}
