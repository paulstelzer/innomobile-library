import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CheckLanguage, UpdateLanguage, UseLanguage } from '../actions/language.actions';
import { LanguageConfigModel, LanguageStateModel } from '../model/language.model';
import { LANGUAGE_CONFIG } from '../model/language.token';

/**
 * Language State @ NGXS
 */
@Injectable()
@State<LanguageStateModel>({
    name: 'language',
    defaults: {
        lang: null
    }
})
export class LanguageState implements NgxsOnInit {

    /**
     * Get the current language code
     * @param state Language state
     */
    @Selector()
    static getLanguage(state: LanguageStateModel) {
        return state.lang;
    }

    /**
     * @ignore
     */
    constructor(
        private translate: TranslateService,
        @Inject(LANGUAGE_CONFIG) private languageConfig: LanguageConfigModel
    ) { }

    /**
     * Dispatch CheckSession on start
     * @ignore
     */
    ngxsOnInit(ctx: StateContext<LanguageStateModel>) {
      console.log('LANGUAGE INIT')
        this.translate.setDefaultLang(this.languageConfig.defaultLanguage);
        ctx.dispatch(new CheckLanguage());
    }

    /**
     * Checks the current language
     * @ignore
     */
    @Action(CheckLanguage)
    checkLanguage(ctx: StateContext<LanguageStateModel>) {
        const saved = ctx.getState().lang;
        console.log('LANGUAGE checkLanguage', saved)
        if (saved) {
            ctx.dispatch(new UpdateLanguage(saved));
        } else {
            const language = this.getSuitableLanguage();
            ctx.dispatch(new UpdateLanguage(language));
        }
    }

    /**
     * Update to given language
     * @param ctx State Context
     * @param param1 Contains the language
     * @ignore
     */
    @Action(UpdateLanguage, { cancelUncompleted: true })
    async updateLanguage(ctx: StateContext<LanguageStateModel>, { lang }: UpdateLanguage) {
        ctx.setState({ lang: lang });
        ctx.dispatch(new UseLanguage());
    }

    /**
     * Use the language
     * @param ctx State Context
     * @ignore
     */
    @Action(UseLanguage, { cancelUncompleted: true })
    useLanguage(ctx: StateContext<LanguageStateModel>): Observable<any> {
        return this.translate.use(ctx.getState().lang);
    }


    /**
     * Try to find the language from browser and returns the language
     * if language is available or the defaultLanguage
     */
    private getSuitableLanguage() {
      console.log('getSuitableLanguage')
        const browserLanguage: string = this.translate.getBrowserLang()
            .substring(0, 2).toLowerCase() || this.languageConfig.defaultLanguage;
        return this.languageConfig.availableLanguages
            .some((x: any) => x.code === browserLanguage)
            ? browserLanguage
            : this.languageConfig.defaultLanguage;
    }

}
