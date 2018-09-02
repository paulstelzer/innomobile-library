export class UpdateLanguage {
    static readonly type = '[LANGUAGE] Update';

    constructor(public lang: string) {}
}

export class CheckLanguage {
    static readonly type = '[LANGUAGE] Check';
}

export class UseLanguage {
    static readonly type = '[LANGUAGE] Use';
}
