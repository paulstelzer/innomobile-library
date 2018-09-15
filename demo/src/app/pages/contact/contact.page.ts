import { IapService, IapState, IapPurchaseApproved } from '@innomobile/iap';
import { Component } from '@angular/core';

import { Select, Actions, ofActionDispatched } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-page-contact',
  templateUrl: 'contact.page.html',
  styleUrls: ['contact.page.scss']
})
export class ContactPage {

  text = '';
  @Select(IapState.purchasedItems) purchasedItems$: Observable<any[]>;
  constructor(
    private actions: Actions,
    private iapService: IapService,
    private toast: ToastController
  ) {
    this.iapService.init();

    this.actions.pipe(ofActionDispatched(IapPurchaseApproved)).subscribe((data) => {
      this.sendToast(data);
      this.iapService.finish(data.product.alias);
    });

    this.purchasedItems$.subscribe((data) => {
      console.log('purchased', data);
    });
  }

  buy(packageId) {
    this.iapService.purchase(packageId);
  }

  refresh() {
    this.iapService.refresh();
  }

  async sendToast(data) {
    const toast = await this.toast.create({
      message: 'Purchase successfully :) - ' + data.product.alias,
      duration: 3000,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
  }
}
