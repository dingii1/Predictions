import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmailPattern } from '../../consts/consts';
import { LoginBindingModel } from '../../models/login-models/binding-models/login-binding-model';
import { LoginViewModel } from '../../models/login-models/view-models/login-view-model';
import { AuthenticationService } from '../../services/authentication.service';

import { FormValidationService } from '../../services/form-validation.service';
import { LoadingSpinnerService } from '../../services/loading-spinner.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private returnUrl: string;

    private subscription: Subscription;

    constructor(public formValidationService: FormValidationService, public authenticationService: AuthenticationService, private formBuilder: FormBuilder, private routerService: Router, private route: ActivatedRoute, private loadingSpinnerService: LoadingSpinnerService) {
        this.returnUrl = '/home';

        this.subscription = new Subscription();
    }

    ngOnInit(): void {
        this.initFormValidationService();
    }

    onSubmitButtonClicked(): void {
        if (this.formValidationService.isValid) {
            this.formValidationService.clearErrors();

            this.submitModel();
        }
    }

    private initFormValidationService(): void {
        this.formValidationService.init(this.generateFormGroup());
    }

    private generateFormGroup(): FormGroup {
        let loginBindingModel = new LoginBindingModel();

        let emailFormControl = this.formBuilder.control(loginBindingModel.email,
            [
                Validators.required,
                Validators.email,
                Validators.pattern(EmailPattern)
            ]
        );

        let passwordFormControl = this.formBuilder.control(loginBindingModel.password,
            [
                Validators.required
            ]
        );

        return this.formBuilder.group({
            email: emailFormControl,
            password: passwordFormControl,
        });
    }

    private submitModel(): void {
        this.loadingSpinnerService.showLoadingSpinner();

        let loginBindingModel: LoginBindingModel = this.getLoginBindingModel();

        this.subscription.add(this.authenticationService.login(loginBindingModel)
            .subscribe({
                next: (loginViewModel: LoginViewModel) => {
                    this.loadingSpinnerService.hideLoadingSpinner();

                    this.routerService.navigateByUrl(this.returnUrl);
                },
                error: (errorResponse: HttpErrorResponse) => {
                    this.formValidationService.handleErrorResponse(errorResponse);

                    this.loadingSpinnerService.hideLoadingSpinner();
                }
            }))
    }

    private getLoginBindingModel(): LoginBindingModel {
        let loginBindingModel: LoginBindingModel = this.formValidationService.getValue();

        if (loginBindingModel.email !== undefined &&
            loginBindingModel.email !== null) {
            loginBindingModel.email = loginBindingModel.email.trim();
        }

        if (loginBindingModel.password !== undefined &&
            loginBindingModel.password !== null) {
            loginBindingModel.password = loginBindingModel.password.trim();
        }

        return loginBindingModel;
    }
}