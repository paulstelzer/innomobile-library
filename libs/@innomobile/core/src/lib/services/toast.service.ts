import { Injectable } from '@angular/core';

import { ToastOptions } from '@ionic/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private translate: TranslateService, private toastCtrl: ToastController) { }


    async sendToastTranslation(type: string, message: string, options: ToastOptions = null) {
        const res: string = await this.translate.get(message).toPromise();

        const closeButtonText: string = await this.translate.get('TOAST.OKAY').toPromise();
        options = {
            closeButtonText: closeButtonText,
            ...options,
        };
        return this.sendToast(type, res, options);
    }

    /**
     * Sendet einen Toast
     * @param type error, success
     * @param message
     * @param options
     */
    async sendToast(type: string, message: string, options?: ToastOptions) {
        let cssClass = 'default';
        switch (type) {
            case 'error':
                cssClass = 'error';
                break;
            case 'success':
                cssClass = 'success';
                break;
            case 'info':
                cssClass = 'info';
                break;
            default:
                cssClass = 'default';
                break;
        }

        let toastOptions: ToastOptions = {
            message: message,
            cssClass: 'toast-' + cssClass,
            duration: 6000,
            showCloseButton: true,
            closeButtonText: 'OKAY',
        };

        toastOptions = Object.assign(toastOptions, options);

        const toast = await this.toastCtrl.create(toastOptions);
        return toast.present();
    }
}
