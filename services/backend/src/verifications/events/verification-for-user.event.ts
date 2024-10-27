import { SessionData } from '../verifications.interface';
import { UserEvent } from 'src/common/events/user.event';


export class VerificationForUserEvent extends UserEvent implements SessionData {
    constructor(userId: number) {
        super(userId);
    }
}