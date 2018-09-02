import { MessageModel } from "../store/notifications.model";

export class Message implements MessageModel {
    id: string;
    icon: string;
    iconType: string;

    title: string;
    description: string;

    link: string;
    linkType: string;

    color: string;

    createdAt: Date;
    updatedAt: Date;

    constructor(data?) {
        data = data || {};
        if (data.id) {
            this.id = data.id;
        }

        this.icon = data.icon || '';
        this.iconType = data.iconType || 'material';

        this.title = data.title || '';
        this.description = data.description || '';

        this.link = data.link || '';
        this.linkType = data.linkType || 'internal';

        this.color = data.color || '';

        this.createdAt = this.getDate(data.createdAt);
        this.updatedAt = this.getDate(data.updatedAt);
    }

    getDate(input) {
        if (input) {
            if (input instanceof Date) {
                return input;
            } else if (input.toDate instanceof Function) {
                return input.toDate();
            } else {
                return new Date(input);
            }
        }

        return new Date();
    }

    export() {
        const object = this;
        return Object.assign({}, object);
    }
}
