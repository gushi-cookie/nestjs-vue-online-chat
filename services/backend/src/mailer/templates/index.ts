// import pug from 'pug';
// import { EmailVerificationTemplate } from './templates.interface';


// const assetsPath = 'src/mailer/templates/assets';


// const regExp = /<p>|<\/p>/g;
// function removeTagFromPlainText(text: string): string {
//     return text.replaceAll(regExp, '');
// }


// // ######################
// // # Email Verification #
// // ######################
// const compiledEmailVerification = pug.compileFile(assetsPath + '/email-verification.pug');
// const compiledEmailVerificationPlain = pug.compileFile(assetsPath + '/email-verification-plain.pug');

// const emailVerification = {
//     render: (data: EmailVerificationTemplate): string => {
//         return compiledEmailVerification(data);
//     },
//     renderPlain: (data: EmailVerificationTemplate): string => {
//         return removeTagFromPlainText(
//             compiledEmailVerificationPlain(data)
//         );
//     }
// }

// export const templates = {
//     emailVerification
// }