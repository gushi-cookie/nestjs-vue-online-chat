export enum SignInException {
    UserNotFound,
    UserUnverified,
    WrongPassword,
}

export enum SignUpException {
    LoginOccupied,
    EmailOccupied,
}