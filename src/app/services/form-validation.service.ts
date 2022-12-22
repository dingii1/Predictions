import { Injectable } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorsContainer } from '../models/errors-container';
import { TryGetControlResult } from '../models/try-get-control-result';
import { IValidationErrors } from '../interfaces/validation-errors';
import { ValidationErrors } from '../models/validation-errors';

const ModelValidationErrorsKey = 'errors';

@Injectable({
    providedIn: 'root'
})
export class FormValidationService {
    errors: ErrorsContainer;

    formGroup!: FormGroup;

    constructor() {
        this.errors = new ErrorsContainer();
    }

    get isValid(): boolean {
        this.validateControls(this.formGroup);

        return this.formGroup.disabled || this.formGroup.valid;
    }

    init(formGroup: FormGroup): void {
        this.formGroup = formGroup;
    }

    validate(formControlName: null | string | number | (string | number)[]): void {
        if (formControlName === null) {
            this.formGroup.markAllAsTouched();
            this.formGroup.updateValueAndValidity();
        }
        else {
            let control = this.getControl(formControlName);

            control.markAsTouched();
            control.updateValueAndValidity();
        }
    }

    controlHasError(formControlName: string | number | (string | number)[], errorKey?: string): boolean {
        let control = this.getControl(formControlName);

        let doesControlHaveErrors = false;
        if (errorKey !== undefined &&
            errorKey !== null) {
            doesControlHaveErrors = control.touched &&
                control.hasError(errorKey);
        }
        else {
            doesControlHaveErrors = control.touched &&
                !control.valid;
        }

        return doesControlHaveErrors;
    }

    handleErrorResponse(errorResponse: HttpErrorResponse): void {
        switch (errorResponse?.error?.error?.message) {
            case 'EMAIL_EXISTS':
                this.setGeneralErrors(['Email already exists.']);
                break;

            case 'OPERATION_NOT_ALLOWED':
                this.setGeneralErrors(['Password sign-in is disabled.']);
                break;

            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                this.setGeneralErrors(['To many attempts to sign-up, please try again later.']);
                break;

            case 'EMAIL_NOT_FOUND':
                this.setGeneralErrors(['There is no user with the corresponding email.']);
                break;

            case 'INVALID_PASSWORD':
                this.setGeneralErrors(['The password is invalid or the user does not have a password.']);
                break;

            case 'USER_DISABLED':
                this.setGeneralErrors(['The user account has been disabled by an administrator.']);
                break;

            default:
                this.setGeneralErrors(['Unknown error occured.']);
                break;
        }
    }

    setErrors(errors: string | ValidationErrors): void {
        if (typeof errors === 'string') {
            this.setGeneralErrors([errors]);
        }
    }

    getErrors(formControlName?: string | number | (string | number)[]): string[] {
        let errors: any[] = [];
        if (formControlName === undefined ||
            formControlName === null) {
            errors = this.errors.general;
        }
        else if (Array.isArray(formControlName)) {
            let currentErrorsContainer: IValidationErrors = this.errors;
            for (let i = 0; i < formControlName.length; i++) {
                let currentErrors = currentErrorsContainer[formControlName[i]];
                if (currentErrors === undefined ||
                    currentErrors === null) {
                    break;
                }

                if (!Array.isArray(currentErrors)) {
                    currentErrorsContainer = currentErrors;
                }
                else {
                    errors = currentErrors;
                }
            }
        }
        else {
            let currentErrors = this.errors[formControlName];
            if (Array.isArray(currentErrors)) {
                errors = currentErrors;
            }
        }

        return errors;
    }

    clearErrors(): void {
        this.errors = new ErrorsContainer();
    }

    clearControlErrors(formControlName: string | number | (string | number)[]): void {
        if (typeof formControlName === 'string') {
            this.errors[formControlName] = [];
        }
        else if (Array.isArray(formControlName) &&
            typeof formControlName[0] === 'string') {
            this.errors[formControlName[0]] = [];
        }

        let control = this.getControl(formControlName);
        if (control !== null) {
            control.setErrors(null);
            control.updateValueAndValidity();
        }
    }

    getLength(formControlName: string | number | (string | number)[]): number {
        let control = this.getControl(formControlName);
        if (control instanceof FormArray) {
            return control.length;
        }

        return 0;
    }

    getValue<T>(formControlName?: string | number | (string | number)[]): T {
        let value: T;
        if (formControlName !== undefined &&
            formControlName !== null &&
            formControlName !== '') {
            let control = this.getControl(formControlName);

            if (control instanceof FormGroup ||
                control instanceof FormArray) {
                value = control.getRawValue() as T;
            }
            else {
                value = control.value as T;
            }
        }
        else {
            value = this.formGroup.getRawValue() as T;
        }

        return value;
    }

    addValue(formControlName: string | number | (string | number)[], value: any): void {
        let control = this.getControl(formControlName);
        if (control instanceof FormArray) {
            control.push(value);

            control.updateValueAndValidity();
        }
    }

    removeValue(formControlName: string | number | (string | number)[], index: number): void {
        let control = this.getControl(formControlName);
        if (control instanceof FormArray &&
            index !== undefined &&
            index !== null) {
            control.removeAt(index);

            control.updateValueAndValidity();
        }
    }

    /**
     * Update AbstractControl value.
     */
    updateValue(value: any, formControlName?: string | number | (string | number)[]): void {
        let control: AbstractControl = this.formGroup;
        if (formControlName !== undefined &&
            formControlName !== null &&
            formControlName !== '') {
            control = this.getControl(formControlName);
        }

        if (control instanceof FormArray &&
            Array.isArray(value)) {
            for (let i = 0; i < control.length; i++) {
                control.removeAt(i);

                i--;
            }

            for (let i = 0; i < value.length; i++) {
                control.push(value[i]);
            }
        }
        else {
            control.patchValue(value);
        }

        control.updateValueAndValidity();
    }

    /**
     * This method will trigger control state to enable or disable.
     *
     * If formControlName is not passed it will update state of the initial FormGroup.
     */
    updateState(shouldBeEnabled: boolean, formControlName?: string | number | (string | number)[]): void {
        let control: AbstractControl = this.formGroup;
        if (formControlName !== undefined &&
            formControlName !== null &&
            formControlName !== '') {
            control = this.getControl(formControlName);
        }

        if (shouldBeEnabled) {
            control.enable();
        }
        else {
            control.markAsUntouched();

            control.disable();
        }

        control.updateValueAndValidity();
    }

    reset(): void {
        if (this.formGroup !== undefined &&
            this.formGroup !== null) {
            this.formGroup.reset();
        }
    }

    /**
     *
     * Clear the form errors, reset the form group and then destroy it.
     *
     */
    dispose(): void {
        this.clearErrors();

        this.reset();
    }

    private getControl(formControlName: string | number | (string | number)[], formGroup: AbstractControl = this.formGroup): AbstractControl {
        let result = this.tryGetControl(formControlName, formGroup);

        if (!result.isControlFound ||
            result.control === null) {
            let controlName: string;
            if (Array.isArray(formControlName)) {
                controlName = formControlName.join(" > ");
            }
            else {
                controlName = formControlName.toString();
            }

            throw new Error("Cannot find control '" + controlName + "'.");
        }

        return result.control;
    }

    private tryGetControl(formControlName: string | number | (string | number)[], formGroup: AbstractControl = this.formGroup): TryGetControlResult {
        let control: AbstractControl | null = null;

        if (formGroup !== null &&
            formGroup !== undefined) {
            if (Array.isArray(formControlName)) {
                control = formGroup;
                formControlName.forEach(value => {
                    if (control !== null) {
                        control = this.tryGetControl(value, control).control;
                    }
                });
            }
            else if (typeof formControlName === 'number') {
                if (formGroup instanceof FormArray) {
                    control = (formGroup as FormArray).at(formControlName);
                }
                else {
                    control = null;
                }
            }
            else {
                control = formGroup.get(formControlName);
            }
        }

        return new TryGetControlResult(control);
    }

    private setGeneralErrors(errors: string[]): void {
        if (this.formGroup.untouched) {
            this.formGroup.markAsTouched();
        }

        this.formGroup.setErrors({ invalid: true });

        for (let i = 0; i < errors.length; i++) {
            this.errors.general.push(errors[i]);
        }
    }

    private validateControls(formGroup: FormGroup | FormArray): void {
        Object.keys(formGroup.controls).forEach(field => {
            let control = formGroup.get(field);

            if (control instanceof FormControl) {
                if (control.enabled) {
                    control.markAsTouched();

                    control.updateValueAndValidity();
                }
            }
            else {
                if (control instanceof FormGroup) {
                    this.validateControls(control as FormGroup);
                }
                else {
                    this.validateControls(control as FormArray);
                }
            }
        });
    }
}