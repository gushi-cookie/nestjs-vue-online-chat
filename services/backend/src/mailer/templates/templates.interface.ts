// import { Language } from 'src/localization/localization.interface';


export interface HeadTemplate {
    title: string;
}

export interface FooterTemplate {

}

export interface EmailVerificationTemplate extends HeadTemplate, FooterTemplate {
    lang: string;
    logoSrc: string;
    nickname: string;
    verifyLink: string;
}