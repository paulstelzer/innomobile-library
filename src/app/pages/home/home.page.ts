import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Platform, Slides } from '@ionic/angular';

// NGXS
import { Store } from '@ngxs/store';

import { UpdateLanguage, AuthService, FireAuthUserSignOut, FireAuthAnonymousSignUp } from '@innomobile/fireuser';
import { BranchService, AppsflyerService } from '@innomobile/attribution';
import { ToastService } from '@innomobile/core';

@Component({
    selector: 'app-page-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    @ViewChild(Slides) slides: Slides;
    version = '';
    branchData = null;

    constructor(
        private platform: Platform,
        private toast: ToastService,
        private store: Store,
        private authService: AuthService,
        private branch: BranchService,
        private appsflyer: AppsflyerService
    ) {
        this.init();

        this.platform.resume.subscribe(() => {
            this.init();
        });

        this.appsflyer.init();
    }

    ngOnInit() {
        this.version = environment.version;

        this.slides.update();
        this.slides.lockSwipes(true);
    }

    async init() {
        if (this.platform.is('cordova')) {
            this.branchData = await this.branch.initSession();
            console.log('Data branch', JSON.stringify(this.branchData));
        }
    }

    async signIn() {
        console.log('Sign in');
        this.store.dispatch(new FireAuthAnonymousSignUp());

        const data = this.store.selectSnapshot(state => state.auth.authUser);
        console.log('[selectSnapshot] User Data', data);
    }

    setLanguage(lang) {
        this.store.dispatch(new UpdateLanguage(lang));
        this.toast.sendToastTranslation('error', 'Test it');
    }

    logout() {
        this.store.dispatch(new FireAuthUserSignOut());
    }

    share() {
        this.branch.share('Subject', 'My Message', { channel: 'viral', campaign: 'Party', }, { contentMetadata: { userId: 123 } });
    }
}
