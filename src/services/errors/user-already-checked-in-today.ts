export class UserAlreadyCheckedInTodayError extends Error {
    constructor() {
        super("User already checked in on gym today.")
    }
}