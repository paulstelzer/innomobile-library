import { BRANCH_CONFIG, BranchConfigOptions } from './../attribution.module';
import { Injectable, Optional, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { BranchIo, BranchIoPromise, BranchIoAnalytics, BranchIoProperties } from '@ionic-native/branch-io/ngx';
import { BranchShareOptions } from './model/branch.interface';

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

  private initBranchWeb(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!window['branch']) {
        reject('no_branch_sdk');
      } else {
        window['branch'].init(this.branchConfig.branchKey, null, (error, data) => {
          this.initialized = true;
          if (data) {
            resolve(data);
          } else if (error) {
            reject(error);
          }
        });
      }
    });
  }

  private async initWebSession() {
    if (!this.branchConfig || !this.branchConfig.branchKey) { return null; }

    try {
      const data = await this.initBranchWeb();
      if (data) {
        const parsed: BranchIoPromise = data.data_parsed;
        return parsed;
      }
    } catch (err) {
      console.log('BRANCH ERROR', err);
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

    if (this.platform.is('cordova')) {
      return this.branch.setIdentity(userId);
    } else {
      return window['branch'].setIdentity(userId);
    }
  }

  async shareLink(options: BranchShareOptions) {
    if (this.platform.is('cordova')) {
      const properties: BranchIoProperties = {
        canonicalIdentifier: options.canonicalIdentifier,
        contentMetadata: options.contentMetadata
      };
      return this.share(options.subject, options.message, options.analytics, properties);
    } else {
      if (options.openShareScreen instanceof Function) {
        let link = '';
        try {
          link = await this.linkBranchWeb(options.analytics, options.contentMetadata, options.ogData);
        } catch (error) {
          link = options.defaultLink;
        }

        return options.openShareScreen(options.subject, options.message, link);
      }
    }
    return null;
  }

  async share(subject: string, message: string, analytics: BranchIoAnalytics, properties: BranchIoProperties): Promise<void> {
    if (!this.platform.is('cordova')) { return; }
    if (!this.initialized) { return; }

    try {
      const branchUniversalObj = await this.branch.createBranchUniversalObject(properties);
      const response1 = await branchUniversalObj.generateShortUrl(analytics, properties);

      return await this.socialSharing.shareWithOptions({
        message: message + ' ' + response1.url,
        subject: subject
      });

    } catch (err) {
      console.log(err);
    }
  }

  private linkBranchWeb(analytics, contentMetadata, ogData): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!window['branch']) {
        reject('no_branch_sdk');
      } else {
        window['branch'].link({
          ...analytics,
          data: {
            ...contentMetadata,
            ...ogData,
          }
        }, (err, link: string) => {
          if (!link || err) {
            reject('no_link');
          }
          resolve(link);
        });
      }
    });
  }
}
