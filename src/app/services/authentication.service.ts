import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { LoginBindingModel } from '../models/login-models/binding-models/login-binding-model';
import { LoginViewModel } from '../models/login-models/view-models/login-view-model';
import { RegisterBindingModel } from '../models/register-models/binding-models/register-binding-model';
import { RegisterViewModel } from '../models/register-models/view-models/register-view-model';
import { UserViewModel } from '../models/user-models/view-models/user-view-model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    public user: Subject<UserViewModel>;

    constructor(private httpClient: HttpClient) {
        this.user = new Subject<UserViewModel>();
    }

    login(model: LoginBindingModel): Observable<LoginViewModel> {
        return this.httpClient.post<LoginViewModel>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDl_iGCKhZ-kHTGT-1jJ3TH_ye2insjJwI',
            {
                email: model.email,
                password: model.password,
                retunSecureToken: true
            })
            .pipe(tap((loginViewModel) => {
                this.handleAuthentication(loginViewModel);
            }));
    }

    register(model: RegisterBindingModel): Observable<RegisterViewModel> {
        return this.httpClient.post<RegisterViewModel>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDl_iGCKhZ-kHTGT-1jJ3TH_ye2insjJwI',
            {
                email: model.email,
                password: model.confirmPassword,
                retunSecureToken: true
            })
            .pipe(tap((registerViewModel) => {
                this.handleAuthentication(registerViewModel);
            }));
    }

    private handleAuthentication(model: LoginViewModel | RegisterViewModel) {
        const expirationDate = new Date(new Date().getTime() + +model.expiresIn * 1000);

        const user = new UserViewModel(model.email, model.localId, model.idToken, expirationDate);

        this.user.next(user);
    }
}