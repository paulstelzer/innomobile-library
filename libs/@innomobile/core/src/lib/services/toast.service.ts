import { Injectable } from '@angular/core';

import { ToastOptions } from '@ionic/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private translate: TranslateService, private toastCtrl: ToastController) { }


    sendToastTranslation(type: string, message: string, options: ToastOptions = null) {
        this.translate.get(message).subscribe((res: string) => {
            this.sendToast(type, res, options);
        });
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

        let toastOptions = {
            message: message,
            cssClass: 'toast-' + cssClass,
            duration: 6000,
            showCloseButton: true,
            dismissOnPageChange: false
        };

        toastOptions = Object.assign(toastOptions, options);

        let toast = await this.toastCtrl.create(toastOptions);
        toast.present();
    }

}