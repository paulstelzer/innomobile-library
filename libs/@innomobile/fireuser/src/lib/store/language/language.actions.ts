/**
 * Updates the state to the given language
 */
export class UpdateLanguage {
    /**
     * @ignore
     */
    static readonly type = '[LANGUAGE] Update';

    /**
     * Update language to the given code
     * @param lang Language Code
     */
    constructor(public lang: string) { }
}

/**
 * Checks the language of the browser and updates the language
 */
export class CheckLanguage {
    /**
     * @ignore
     */
    static readonly type = '[LANGUAGE] Check';
}

/**
 * After updating the language the new language should be used
 */
export class UseLanguage {
    /**
     * @ignore
     */
    static readonly type = '[LANGUAGE] Use';
}
