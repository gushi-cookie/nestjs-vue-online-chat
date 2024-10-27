import { BaseEvent } from './base.event';


export class UserEvent extends BaseEvent {
    readonly userId: number;

    constructor(userId: number) {
        super();
        this.userId = userId;
    }
}