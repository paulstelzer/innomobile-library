import { BRANCH_CONFIG, BranchConfigOptions } from './../attribution.module';
import { Injectable, Optional, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { BranchIo, BranchIoPromise, BranchIoAnalytics, BranchIoProperties } from '@innomobile-native/branch/ngx';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  initialized = false;
  debug = false;
  lastUserId = '';

  constructor(
    private platform: Platform,
    private branch: BranchIo,
    private socialSharing: SocialSharing,
    @Optional() @Inject(BRANCH_CONFIG) private branchConfig: BranchConfigOptions,
  ) {

  }

  async initSession(): Promise<BranchIoPromise> {
    if (!this.platform.is('cordova')) { return; }

    await this.platform.ready();

    if (this.branchConfig && this.branchConfig.debug) {
      this.branch.setDebug(this.branchConfig.debug);
    }

    try {
      const data = await this.branch.initSession();
      this.initialized = true;
      return data;
    } catch (error) {
      console.log('[Branch] Error on init', error);
      return null;
    }
  }

  async getSession(): Promise<BranchIoPromise> {
    return await this.branch.initSession();
  }


  setIdentity(userId): Promise<any> {
    if (!this.initialized) { return; }

    if (this.lastUserId === userId) { return; }

    this.lastUserId = userId;

    return this.branch.setIdentity(userId);
  }

  async share(subject: string, message: string, analytics: BranchIoAnalytics, properties: BranchIoProperties): Promise<void> {
    if (!this.initialized) { return; }

     
    try {
      const branchUniversalObj = await this.branch.createBranchUniversalObject(properties);
      const response1 = await branchUniversalObj.generateShortUrl(analytics, properties);
      //branchUniversalObj.showShareSheet(analytics, properties, message)

      await this.socialSharing.shareWithOptions({
        message: message + ' ' + response1.url,
        subject: subject
      });

    } catch (err) {
      console.log(err);
    }
  }
}
