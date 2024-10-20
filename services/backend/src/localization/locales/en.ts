import { Locale } from '../localization.interface';


const en: Locale = {
    email: {
        regVerification: {
            title: 'Email verification',
            subject: 'Verify your email',
            header: {
                logoAlt: 'Logo',
            },
            content: {
                h2: 'Verify Your Email Address',
                p: 'Hi, ((nickname))! Please click the link below to verify your email address and activate your account.',
                buttonText: 'Verify Email',
            },
            footer: {
                p: 'If you did not create an account, no further action is required.'
            }
        }
    }
};

export default en;