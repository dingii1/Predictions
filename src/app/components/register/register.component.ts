import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmailPattern, NamePattern, PasswordPattern, PhonePattern } from '../../consts/consts';
import { RegisterBindingModel } from '../../models/register-models/binding-models/register-binding-model';
import { FormValidationService } from '../../services/form-validation.service';
import { LoadingSpinnerService } from '../../services/loading-spinner.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
    private returnUrl: string;

    private subscription: Subscription;

    constructor(public formValidationService: FormValidationService, private routerService: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private loadingSpinnerService: LoadingSpinnerService) {
        this.returnUrl = '/';

        this.subscription = new Subscription();
    }

    ngOnInit(): void {
        this.formValidationService.init(this.generateFormGroup());
    }

    onSubmitButtonClicked(): void {
        if (this.formValidationService.isValid) {
            this.formValidationService.clearErrors();

            let register: RegisterBindingModel = this.getModel();

            if (this.validateModel(register)) {
                this.register(register);
            }
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();

        this.formValidationService.dispose();
    }

    private generateFormGroup(): FormGroup {
        let firstNameFormControl = this.formBuilder.control('',
            [
                Validators.required,
                Validators.pattern(NamePattern),
                Validators.maxLength(100)
            ]
        );

        let lastNameFormControl = this.formBuilder.control('',
            [
                Validators.required,
                Validators.pattern(NamePattern),
                Validators.maxLength(100)
            ]
        );

        let professionFormControl = this.formBuilder.control('',
            [
                Validators.maxLength(100)
            ]
        );

        let passwordFormControl = this.formBuilder.control('',
            [
                Validators.minLength(6),
                Validators.required,
                Validators.pattern(PasswordPattern)
            ]
        );

        let confirmPasswordFormControl = this.formBuilder.control('',
            [
                Validators.minLength(6),
                Validators.required,
                Validators.pattern(PasswordPattern)
            ]
        );

        let emailFormControl = this.formBuilder.control('',
            [
                Validators.required,
                Validators.pattern(EmailPattern)
            ]
        );

        let phoneFormControl = this.formBuilder.control('',
            [
                Validators.pattern(PhonePattern),
                Validators.maxLength(100)
            ]
        );

        let privacyPolicyFormControl = this.formBuilder.control(false,
            [
                Validators.requiredTrue
            ]
        );

        let dateOfBirthFormControl = this.formBuilder.control('');

        return this.formBuilder.group({
            firstName: firstNameFormControl,
            lastName: lastNameFormControl,
            profession: professionFormControl,
            email: emailFormControl,
            password: passwordFormControl,
            confirmPassword: confirmPasswordFormControl,
            phoneNumber: phoneFormControl,
            privacyPolicy: privacyPolicyFormControl,
            dateOfBirth: dateOfBirthFormControl
        });
    }

    private getModel(): RegisterBindingModel {
        let register: RegisterBindingModel = this.formValidationService.getValue();

        if (register.firstName !== null &&
            register.firstName !== undefined) {
            register.firstName = register.firstName.trim();
        }

        if (register.lastName !== null &&
            register.lastName !== undefined) {
            register.lastName = register.lastName.trim();
        }

        if (register.phoneNumber !== null &&
            register.phoneNumber !== undefined) {
            register.phoneNumber = register.phoneNumber.trim();
        }

        if (register.email !== null &&
            register.email !== undefined) {
            register.email = register.email.trim();
        }

        if (register.dateOfBirth !== null &&
            register.dateOfBirth !== undefined &&
            register.dateOfBirth.toString() !== '') {
            register.dateOfBirth = new Date(register.dateOfBirth);
        }

        if (register.password !== undefined &&
            register.password !== null) {
            register.password = register.password.trim();
        }

        if (register.confirmPassword !== undefined &&
            register.confirmPassword !== null) {
            register.confirmPassword = register.confirmPassword.trim();
        }

        return register;
    }

    private validateModel(register: RegisterBindingModel): boolean {
        let isModelValid = true;
        if (register.password !== register.confirmPassword) {
            this.formValidationService.clearControlErrors('confirmPassword');
            this.formValidationService.setErrors({ 'confirmPassword': ['Password missmatch.'] });

            isModelValid = false;
        }

        return isModelValid;
    }

    private register(register: RegisterBindingModel): void {
        this.loadingSpinnerService.showLoadingSpinner();

        // this.subscription.add(this.accountsService.register(register)
        //     .subscribe(() => {
        //         this.loadingSpinnerService.hideLoadingSpinner();

        //         this.routerService.navigateByUrl(this.returnUrl);
        //     }, (errorResponse: HttpErrorResponse) => {
        //         this.formValidationService.handleErrorResponse(errorResponse);

        //         this.loadingSpinnerService.hideLoadingSpinner();
        //     }));
    }
}