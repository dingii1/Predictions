import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginBindingModel } from '../models/login-models/binding-models/login-binding-model';
import { RegisterBindingModel } from '../models/register-models/binding-models/register-binding-model';
import { RegisterViewModel } from '../models/register-models/view-models/register-view-model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private httpClient: HttpClient) { }

    login(model: LoginBindingModel) {
        return this.httpClient.post('https://predictions-5b31b-default-rtdb.firebaseio.com', model);
    }

    register(model: RegisterBindingModel): Observable<RegisterViewModel> {
        return this.httpClient.post<RegisterViewModel>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDl_iGCKhZ-kHTGT-1jJ3TH_ye2insjJwI',
            {
                email: model.email,
                password: model.confirmPassword,
                retunSecureToken: true
            });
    }
}