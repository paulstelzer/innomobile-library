import {Injectable} from '@angular/core'

import {ToastOptions} from '@ionic/core'
import {ToastController} from '@ionic/angular'
import {TranslateService} from '@ngx-translate/core'

export interface InnoToastOptions {
  showButtons?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private translate: TranslateService,
    private toastCtrl: ToastController,
  ) {
  }


  async sendToastTranslation(color: string, message: string, options: ToastOptions & InnoToastOptions = null, translateParams?: any) {
    let res: string
    if (translateParams) {
      res = await this.translate.get(message, translateParams).toPromise()
    } else {
      res = await this.translate.get(message).toPromise()
    }

    const closeButtonText: string = await this.translate.get('TOAST.OKAY').toPromise()
    options = {
      showButtons: true,
      ...options,
    }

    const buttons = options.showButtons ? options.buttons || [
      {
        text: closeButtonText,
        role: 'cancel',
      }
    ] : null

    options.buttons = buttons

    return this.sendToast(color, res, options)
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
    }

    toastOptions = Object.assign(toastOptions, options)

    const toast = await this.toastCtrl.create(toastOptions)
    return toast.present()
  }
}
