import firebase from 'firebase/app';
import { Action, Selector, State, StateContext, NgxsOnInit, Store } from '@ngxs/store';

import { switchMap, map } from 'rxjs/operators';

import { of } from 'rxjs';
import {
    NotificationsStateModel,
    MessageModel,
    NotificationsConfig
} from './notifications.model';

import {
    InitNotifications,
    SetNotifications,
    AddMessage,
    UpdateMessage,
    RemoveNotification,
    RemoveAllNotifications
} from './notifications.actions';

import { Message } from '../classes/message.class';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Inject, Injectable } from '@angular/core';

@Injectable()
@State<NotificationsStateModel>({
    name: 'notifications',
    defaults: {
        messages: []
    }
})
export class NotificationState implements NgxsOnInit {
    private notificationRef: AngularFirestoreCollection<MessageModel[]> = null;
    /**
     * Selectors
     */
    @Selector()
    static getNotifications(state: NotificationsStateModel): Message[] {
        if (state.messages && state.messages.length) {
            const messages = [];
            for (const message of state.messages) {
                messages.push(new Message(message));
            }
            return messages;
        }
        return null;
    }

    @Selector()
    static countNotifications(state: NotificationsStateModel): number {
        if (state.messages && state.messages.length) { return state.messages.length; }
        return 0;
    }

    constructor(
        private fs: AngularFirestore,
        private store: Store,
        @Inject('notificationsConfig') private notificationsConfig: NotificationsConfig
    ) { }

    /**
     * Init
     */
    ngxsOnInit(ctx: StateContext<NotificationsStateModel>) {
        ctx.dispatch(new InitNotifications());
        this.store.select(state => state.auth.authUser).pipe(
            switchMap((u) => {
                if (u && u.uid) {
                    this.notificationRef = this.fs
                        .collection(this.notificationsConfig.path.user)
                        .doc(u.uid)
                        .collection<MessageModel[]>(
                            this.notificationsConfig.path.notifications,
                            ref => ref.orderBy('updatedAt', 'desc')
                        );
                    return this.notificationRef.snapshotChanges().pipe(
                        map(actions => {
                            return actions.map(a => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                return new Message({ id, ...data });
                            });
                        })
                    );
                } else {
                    this.notificationRef = null;
                    return of<MessageModel[]>(null);
                }
            })
        ).subscribe((data) => {
            console.log('Notifcations Service Data', data);
            this.store.dispatch(new SetNotifications(data));
        });
    }

    /**
     * Commands
     */
    @Action(InitNotifications)
    initNotifications(ctx: StateContext<NotificationsStateModel>) {
        const state = ctx.getState();
        if (!state) {
            return ctx.setState({
                messages: []
            });
        }
    }

    @Action(SetNotifications)
    setNotifications(ctx: StateContext<NotificationsStateModel>, action: SetNotifications) {
        return ctx.patchState({
            messages: action.messages
        });
    }

    @Action(AddMessage)
    async addMessage(ctx: StateContext<NotificationsStateModel>, { message }: AddMessage) {
        if (!this.notificationRef) { return false; }
        try {
            const doc = this.itemDate(message);
            return await this.notificationRef.add(doc);
        } catch (err) {
            return false;
        }
    }

    @Action(UpdateMessage)
    async updateMessage(ctx: StateContext<NotificationsStateModel>, { id, data }: UpdateMessage) {
        if (!this.notificationRef) { return false; }
        try {
            const doc = this.itemDate(data);
            return await this.notificationRef.doc(id).update(doc);
        } catch (err) {
            return false;
        }
    }

    @Action(RemoveNotification)
    async removeNotification(ctx: StateContext<NotificationsStateModel>, { id }: RemoveNotification) {
        if (!this.notificationRef) { return false; }
        try {
            return await this.notificationRef.doc(id).delete();
        } catch (err) {
            return false;
        }
    }

    @Action(RemoveAllNotifications)
    async removeAllNotifications(ctx: StateContext<NotificationsStateModel>) {
        if (!this.notificationRef) { return false; }
        try {
            const messages = ctx.getState().messages;
            messages.forEach((message) => {
                this.notificationRef.doc(message.id).delete();
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    get timestamp(): firebase.firestore.FieldValue {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    itemDate(object: any, newItem: boolean = false): any {
        const date = this.timestamp;
        let newObject = {
            ...object,
            updatedAt: date
        };
        if (newItem) {
            newObject = {
                ...newObject,
                createdAt: date
            };
        }
        return newObject;
    }

}
