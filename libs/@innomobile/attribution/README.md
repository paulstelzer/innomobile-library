# @innomobile/attribution - Appsflyer and Branch.io

- Integrate Appsflyer
- Integrate Branch.io

## Installation

### Install the package:

`npm i @innomobile/attribution`

### Install peer dependencies

You have to install the following packages:

- `@ionic/angular`: `^4.0.0 || >= 4.0.0-beta.6`
- `cordova-plugin-x-socialsharing`: `^5.4.0`,
- `@ionic-native/social-sharing`: `^5.0.0 || >= 5.0.0-beta.18`
- `branch-cordova-sdk`: `^3.0.0`
- `@ionic-native/branch-io`: `^5.0.0 || >= 5.0.0-beta.18`
- `cordova-plugin-appsflyer-sdk`: `^4.4.0`
- `@ionic-native/appsflyer`: `^5.0.0 || >= 5.0.0-beta.18`

### Add to your app.module

```ts
    import { AttributionModule } from '@innomobile/attribution';

    AttributionModule.forRoot(appsflyerConfig, branchConfig),
```

The appsflyerConfig contains the devKey, you find at Appsflyer and the AppId (ID of your app in the App Store)

```ts
export const appsflyerConfig = {
    devKey: '', // From appsflyer.com
    appId: '', // iOS only
};
```

This is your branchConfig:

```ts
export const branchConfig = {
  debug: false, // optional
  branchKey: '', // From branch.io
}
```

## Additional information

Appsflyer is only for Android and iOS. Branch.io is ready for Android, iOS and Web! See use cases for the implementation!

## Use Cases

### Add Branch.io for Web / PWA

`@innomobile/attribution` has out-of-the-box support for a PWA / Web implementation of Branch.io. Just add the Branch JavaScript to your index.html (more information on https://github.com/BranchMetrics/web-branch-deep-linking):

```html
  <script type="text/javascript">
    (function (b, r, a, n, c, h, _, s, d, k) { if (!b[n] || !b[n]._q) { for (; s < _.length;)c(h, _[s++]); d = r.createElement(a); d.async = 1; d.src = "assets/scripts/branch-latest.min.js"; k = r.getElementsByTagName(a)[0]; k.parentNode.insertBefore(d, k); b[n] = h } })(window, document, "script", "branch", function (b, r) { b[r] = function () { b._q.push([r, arguments]) } }, { _q: [], _v: 1 }, "addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking getBrowserFingerprintId".split(" "), 0);
  </script>
```

In this case you have to add the branch-latest.min.js to this directory: `assets/scripts/branch-latest.min.js`. You can also use a CDN or other website. Just change the src!

### Create a Branch Handle Service

I recommend that you create a `branch-handle.service.ts` to handle all Branch.io related 

In your `app.component.ts` add:

```ts
import { Platform } from '@ionic/angular';
import { BranchHandleService } from './services/branch-handle.service';

constructor(
    ...
    private platform: Platform,
    private branchHandler: BranchHandleService,
    ...
) {
    ...
    this.initializeApp();
    ...
}

async initializeApp() {
    await this.platform.ready();
    ...
    this.branchHandler.init();
}
```

The `BranchHandleService` could be like

```ts
import { Injectable } from '@angular/core';
import { BranchService } from '@innomobile/attribution';

@Injectable({
    providedIn: 'root'
})
export class BranchHandleService {
    constructor(
        private branch: BranchService,
    ) {
    }

    async init() {
        try {
            const branchData = await this.branch.initSession();
            this.checkData(branchData);
        } catch (error) {
            console.log('[BRANCH] ERROR', error);
        }
    }

    checkData(data) {
        /* Example of deep link data of Branch.io */
        /*
        data = {
            '~creation_source': 5,
            '+click_timestamp': 1541443185,
            '$identity_id': '588028323188499933',
            'userId': 'asfsaf',
            '+clicked_branch_link': true,
            '$one_time_use': false,
            '~id': '588051199941949836',
            '~campaign': 'Invite',
            '$canonical_url': 'http://localhost:4200/63cc1d35',
            '+is_first_session': true,
            '~referring_link': 'https://xyz.app.link/ARMy3izrBR',
            '~channel': 'viral',
        };*/
        // read deep link data
        console.log('[BRANCH] Deep Link Data: ', data);
        if (!data) {
            return;
        }
        if (data['+clicked_branch_link']) {
            // Add your code here
        }
    }

    /**
     * Set User Id
     **/
    setIdentity(userId) {
        this.branch.setIdentity(userId);
    }

}
```

As described in "Add Branch.io for Web / PWA" you only need  `this.branch.initSession();` - based on the platform (Android, iOS, Web) it will handle the session correctly!

## Overview methods
```ts
initSession(): Promise<BranchIoPromise>;
getSession(): Promise<BranchIoPromise>;
setIdentity(userId: any): Promise<any>;
shareLink(options: BranchShareOptions): Promise<any>;
share(subject: string, message: string, analytics: BranchIoAnalytics, properties: BranchIoProperties): Promise<void>;
```