import { UserEvent } from 'src/common/events/user.event';


class UserLoggedInEvent extends UserEvent {
    constructor(userId: number) {
        super(userId);
    }
}


UserLoggedInEvent.setEventName('auth.user.created');
export default UserLoggedInEvent;