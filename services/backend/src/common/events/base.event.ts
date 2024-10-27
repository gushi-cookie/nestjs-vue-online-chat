export class BaseEvent {
    static eventName: string = 'CHANGE_ME';

    static setEventName(name: string) {
        this.eventName = name;
    }
}