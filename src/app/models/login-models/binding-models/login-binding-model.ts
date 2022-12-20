export class LoginBindingModel {
    email: string | undefined;
    password: string | undefined;
    rememberMe: boolean;

    constructor() {
        this.rememberMe = false;
    }
}