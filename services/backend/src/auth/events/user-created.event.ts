import { UserEvent } from 'src/common/events/user.event';


class UserCreatedEvent extends UserEvent {
    readonly profilePicture?: Express.Multer.File

    constructor(userId: number, profilePicture?: Express.Multer.File) {
        super(userId);
        this.profilePicture = profilePicture;
    }
}


UserCreatedEvent.setEventName('auth.user.created');
export default UserCreatedEvent;