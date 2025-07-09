export class UserTooFarFromGymError extends Error {
    constructor() {
        super("User is to far from gym.")
    }
}