import { Locale } from '../localization.interface';


const ru: Locale = {
    email: {
        regVerification: {
            title: 'Подтверждение почты.',
            subject: 'Подтвердите свою почту',
            header: {
                logoAlt: 'Логотип',
            },
            content: {
                h2: 'Подтвердите свой адрес электронной почты',
                p: 'Приветствуем, ((nickname))! Пожалуйста, нажмите на ссылку ниже чтобы подтвердить свой адрес электронной почты, чтобы активировать аккаунт.',
                buttonText: 'Подтвердить',
            },
            footer: {
                p: 'Если вы не создавали аккаунт, то никаких дальнейших действий не требуется.'
            }
        }
    }
};

export default ru;