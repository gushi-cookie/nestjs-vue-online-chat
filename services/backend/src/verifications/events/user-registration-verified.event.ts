import { VerificationForUserEvent } from './verification-for-user.event';


class UserRegistrationVerifiedEvent extends VerificationForUserEvent {
    constructor(userId: number) {
        super(userId);
    }
}


UserRegistrationVerifiedEvent.setEventName('verification.user-registration');
export default UserRegistrationVerifiedEvent;