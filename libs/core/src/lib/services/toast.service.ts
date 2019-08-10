import { Injectable } from '@angular/core';

import { ToastOptions } from '@ionic/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(
        private translate: TranslateService,
        private toastCtrl: ToastController,
    ) { }


    async sendToastTranslation(color: string, message: string, options: ToastOptions = null, translateParams?: any) {
        let res: string;
        if (translateParams) {
            res = await this.translate.get(message, translateParams).toPromise();
        } else {
            res = await this.translate.get(message).toPromise();
        }

        const closeButtonText: string = await this.translate.get('TOAST.OKAY').toPromise();
        options = {
            closeButtonText,
            ...options,
        };
        return this.sendToast(color, res, options);
    }

    /**
     * Sendet einen Toast
     * @param color primary, danger
     * @param message
     * @param options
     */
    async sendToast(color: string, message: string, options?: ToastOptions) {
        let toastOptions: ToastOptions = {
            message,
            color,
            duration: 6000,
            showCloseButton: true,
            closeButtonText: 'OKAY',
        };

        toastOptions = Object.assign(toastOptions, options);

        const toast = await this.toastCtrl.create(toastOptions);
        return toast.present();
    }
}
