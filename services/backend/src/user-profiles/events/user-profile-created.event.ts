
import { UserEvent } from 'src/common/events/user.event';


class UserProfileCreatedEvent extends UserEvent {
    readonly profileId: number;

    constructor(userId: number, profileId: number) {
        super(userId);
        this.profileId = profileId;
    }
}


UserProfileCreatedEvent.setEventName('user-profile.created');
export default UserProfileCreatedEvent;