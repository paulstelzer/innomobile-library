import { BRANCH_CONFIG, BranchConfigOptions } from './../attribution.module';
import { Injectable, Optional, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { BranchIo, BranchIoPromise, BranchIoAnalytics, BranchIoProperties } from '@ionic-native/branch-io/ngx';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  initialized = false;
  debug = false;
  lastUserId = '';
  branchConfigToken: BranchConfigOptions = null;

  constructor(
    private platform: Platform,
    private branch: BranchIo,
    private socialSharing: SocialSharing,
    @Optional() @Inject(BRANCH_CONFIG) private branchConfig: BranchConfigOptions,
  ) {

  }

  async initSession(): Promise<BranchIoPromise> {
    if (!this.platform.is('cordova')) { return this.initWebSession(); }
    this.branchConfigToken = {
      debug: false,
      ...this.branchConfig
    };
    await this.platform.ready();

    if (this.branchConfigToken && this.branchConfigToken.debug) {
      this.branch.setDebug(this.branchConfigToken.debug);
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

  initBranchWeb(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window['branch']) {
        reject('no_branch_sdk');
      } else {
        window['branch'].init(this.branchConfig.branchKey, null, (error, data) => {
          if (data) {
            resolve(data);
          } else if (error) {
            reject(error);
          }
        });
      }
    });
  }

  async initWebSession() {
    if (!this.branchConfig || !this.branchConfig.branchKey) { return null; }

    try {
      const data = await this.initBranchWeb();
      if (data) {
        const parsed: BranchIoPromise = data.data_parsed;
        return parsed;
      }
    } catch (err) {
      throw err;
    }
    return null;
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
      // branchUniversalObj.showShareSheet(analytics, properties, message)

      await this.socialSharing.shareWithOptions({
        message: message + ' ' + response1.url,
        subject: subject
      });

    } catch (err) {
      console.log(err);
    }
  }
}
