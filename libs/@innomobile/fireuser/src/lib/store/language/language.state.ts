import { Observable } from 'rxjs';
// Section 1
import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { UpdateLanguage, CheckLanguage, UseLanguage } from './language.actions';
import { TranslateService } from '@ngx-translate/core';

import { Inject } from '@angular/core';
import { LanguageConfig } from '../../fireuser.module';

// Section 2
export interface LanguageStateModel {
    lang: string;
}

// Section 3
@State<LanguageStateModel>({
    name: 'language',
    defaults: {
        lang: null
    }
})
export class LanguageState implements NgxsOnInit {

    @Selector()
    static getLanguage(state: LanguageStateModel) {
        return state.lang;
    }

    constructor(
        private translate: TranslateService,
        @Inject('languageConfig') private languageConfig: LanguageConfig
    ) { }

    /**
     * Dispatch CheckSession on start
     */
    ngxsOnInit(ctx: StateContext<LanguageStateModel>) {
        this.translate.setDefaultLang(this.languageConfig.defaultLanguage);
        ctx.dispatch(new CheckLanguage());
    }

    /**
     *
     * @param ctx
     * @param action
     */
    @Action(CheckLanguage)
    checkLanguage(ctx: StateContext<LanguageStateModel>) {
        const saved = ctx.getState().lang;
        if (saved) {
            ctx.dispatch(new UpdateLanguage(saved));
        } else {
            const language = this.getSuitableLanguage();
            ctx.dispatch(new UpdateLanguage(language));
        }
    }

    private getSuitableLanguage() {
        const browserLanguage: string = this.translate.getBrowserLang()
            .substring(0, 2).toLowerCase() || this.languageConfig.defaultLanguage;
        return this.languageConfig.availableLanguages
            .some((x: any) => x.code === browserLanguage)
            ? browserLanguage
            : this.languageConfig.defaultLanguage;
    }

    @Action(UpdateLanguage, { cancelUncompleted: true })
    async updateLanguage(ctx: StateContext<LanguageStateModel>, { lang }: UpdateLanguage) {
        ctx.setState({ lang: lang });
        ctx.dispatch(new UseLanguage());
    }

    @Action(UseLanguage, { cancelUncompleted: true })
    useLanguage(ctx: StateContext<LanguageStateModel>): Observable<any> {
        return this.translate.use(ctx.getState().lang);
    }

}
