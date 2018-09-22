'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`<nav>
    <ul class="list">
        <li class="title">
            <a href="index.html" data-type="index-link">@innomobile/fireuser documentation</a>
        </li>
        <li class="divider"></li>
        ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
</div>
` : '' }
        <li class="chapter">
            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
            <ul class="links">
                    <li class="link">
                        <a href="overview.html" data-type="chapter-link">
                            <span class="icon ion-ios-keypad"></span>Overview
                        </a>
                    </li>
                    <li class="link">
                        <a href="index.html" data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>README
                        </a>
                    </li>
                    <li class="link">
                        <a href="dependencies.html"
                            data-type="chapter-link">
                            <span class="icon ion-ios-list"></span>Dependencies
                        </a>
                    </li>
            </ul>
        </li>
        <li class="chapter modules">
            <a data-type="chapter-link" href="modules.html">
                <div class="menu-toggler linked" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                    <span class="icon ion-ios-archive"></span>
                    <span class="link-name">Modules</span>
                    <span class="icon ion-ios-arrow-down"></span>
                </div>
            </a>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                    <li class="link">
                        <a href="modules/FireuserModule.html" data-type="entity-link">FireuserModule</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"' }>
                <span class="icon ion-ios-paper"></span>
                <span>Classes</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                    <li class="link">
                        <a href="classes/AuthState.html" data-type="entity-link">AuthState</a>
                    </li>
                    <li class="link">
                        <a href="classes/CheckLanguage.html" data-type="entity-link">CheckLanguage</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthAnonymousSignUp.html" data-type="entity-link">FireAuthAnonymousSignUp</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserCheck.html" data-type="entity-link">FireAuthUserCheck</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserCreateFailed.html" data-type="entity-link">FireAuthUserCreateFailed</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserCreateSuccess.html" data-type="entity-link">FireAuthUserCreateSuccess</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserDelete.html" data-type="entity-link">FireAuthUserDelete</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserFailed.html" data-type="entity-link">FireAuthUserFailed</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserNull.html" data-type="entity-link">FireAuthUserNull</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserSignOut.html" data-type="entity-link">FireAuthUserSignOut</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserSignedOutFailed.html" data-type="entity-link">FireAuthUserSignedOutFailed</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserSignedOutSuccess.html" data-type="entity-link">FireAuthUserSignedOutSuccess</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserSuccess.html" data-type="entity-link">FireAuthUserSuccess</a>
                    </li>
                    <li class="link">
                        <a href="classes/FireAuthUserToken.html" data-type="entity-link">FireAuthUserToken</a>
                    </li>
                    <li class="link">
                        <a href="classes/LanguageState.html" data-type="entity-link">LanguageState</a>
                    </li>
                    <li class="link">
                        <a href="classes/UpdateLanguage.html" data-type="entity-link">UpdateLanguage</a>
                    </li>
                    <li class="link">
                        <a href="classes/UseLanguage.html" data-type="entity-link">UseLanguage</a>
                    </li>
            </ul>
        </li>
                <li class="chapter">
                    <div class="simple menu-toggler" data-toggle="collapse"
                        ${ isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"' }>
                        <span class="icon ion-md-arrow-round-down"></span>
                        <span>Injectables</span>
                        <span class="icon ion-ios-arrow-down"></span>
                    </div>
                    <ul class="links collapse"
                    ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                            <li class="link">
                                <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                            </li>
                    </ul>
                </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
                ${ isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"' }>
                <span class="icon ion-md-information-circle-outline"></span>
                <span>Interfaces</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                    <li class="link">
                        <a href="interfaces/AuthStateModel.html" data-type="entity-link">AuthStateModel</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/AvailableLanguageModel.html" data-type="entity-link">AvailableLanguageModel</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/LanguageConfigModel.html" data-type="entity-link">LanguageConfigModel</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/LanguageStateModel.html" data-type="entity-link">LanguageStateModel</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"' }>
                <span class="icon ion-ios-cube"></span>
                <span>Miscellaneous</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                    <li class="link">
                      <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
        </li>
        <li class="divider"></li>
        <li class="copyright">
                Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.svg" class="img-responsive" data-type="compodoc-logo">
                </a>
        </li>
    </ul>
</nav>`);
        this.innerHTML = tp.strings;
    }
});
