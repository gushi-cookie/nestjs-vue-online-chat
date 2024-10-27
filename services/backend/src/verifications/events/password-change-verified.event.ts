import { VerificationForUserEvent } from './verification-for-user.event';


class PasswordChangeVerifiedEvent extends VerificationForUserEvent {
    readonly newPassword: string;

    constructor(userId: number, newPassword: string) {
        super(userId);
        this.newPassword = newPassword;
    }
}


PasswordChangeVerifiedEvent.setEventName('verification.password-change');
export default PasswordChangeVerifiedEvent;