import { Inject, Injectable, Optional } from '@angular/core';
import { SocialSharing, BranchIo, BranchIoAnalytics, BranchIoPromise, BranchIoProperties } from '@innomobile-native/plugins';
import { Platform } from '@ionic/angular';
import { BRANCH_CONFIG, BranchConfigOptions } from './../attribution.module';
import { BranchShareOptions } from './model/branch.interface';

/**
 * Branch Service
 */
@Injectable({
  providedIn: 'root'
})
export class BranchService {
  /**
   * Is branch initialized?
   */
  private initialized = false;
  /**
   * Last user id set to Branch
   */
  private lastUserId = '';
  /**
   * Branch Config token
   */
  private branchConfigToken: BranchConfigOptions = null;

  /**
   * Creates an instance of BranchService.
   * @param platform Ionic
   * @param branch Ionic Native
   * @param socialSharing Ionic Native
   * @param branchConfig Branch Config token
   */
  constructor(
    public branch: BranchIo,
    private platform: Platform,
    private socialSharing: SocialSharing,
    @Optional() @Inject(BRANCH_CONFIG) private branchConfig: BranchConfigOptions,
  ) {

  }

  /**
   * Diable Tracking (Web, Android, iOS)
   * @param bool True or false to disable
   */
  disableTracking(bool) {
    if (!this.platform.is('cordova')) {
      if (window['branch']) {
        window['branch'].disableTracking(bool);
      }
    }
    return this.branch.disableTracking(bool);
  }

  /**
   * Init Branch Session - important add to your app.component.ts
   */
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

  /**
   * Get Branch Web SDK
   */
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

  /**
   * Init Web Session
   */
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

  /**
   * Get Branch Session
   */
  async getSession(): Promise<BranchIoPromise> {
    return await this.branch.initSession();
  }

  /**
   * Track a user
   * @param userId User Id
   */
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

  /**
   * Share a link via Branch.io (Android, iOS, Web)
   * @param options Share options
   */
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

  /**
   * Share Branch link NATIVE (Android and iOS only)
   * @param subject Subject
   * @param message Message
   * @param analytics Branch Analytics Data
   * @param properties Branch Properties
   */
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

  /**
   * Share link via Web SDK
   * @param analytics Branch analytics
   * @param contentMetadata Branch content data
   * @param ogData OG Data like image, title and description
   */
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
