import { Injectable } from '@angular/core';
import { FormGroup, FormArray, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorsContainer } from '../models/errors-container';
import { TryGetControlResult } from '../models/try-get-control-result';
import { IValidationErrors } from '../interfaces/validation-errors';
import { HttpErrorsService } from './http-errors.service';
import { ValidationErrors } from '../models/validation-errors';

const ModelValidationErrorsKey = 'errors';

@Injectable({
    providedIn: 'root'
})
export class FormValidationService {
    errors: ErrorsContainer;

    formGroup!: FormGroup;

    constructor(private httpErrorsService: HttpErrorsService) {
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

    handleErrorResponse(errorResponse: HttpErrorResponse, routerParam?: string | string[], id?: number): void {
        this.httpErrorsService.handleErrorResponse(errorResponse, (errors) => this.setErrors(errors), routerParam, id);
    }

    handleError(httpStatusCode: number, error: string | { [property: string]: string[] }, routerParam?: string | string[], id?: number): void {
        this.httpErrorsService.handleError(httpStatusCode, error, (errors) => this.setErrors(errors), routerParam, id);
    }

    /**
     * Set errors on FormControls or FormGroups. It has limitations to show only the errors from the FormGroup when at the same time there is an error of form controls in the same form group.
     *
     * Examples 1:
     * formValidationService.setErrors('Error !!!') - sets general error of the main form group
     *
     * Example 2:
     *
     * signersValidationErrors = new ValidationErrors();
     * signersValidationErrors[Signers] = new ValidationErrors();
     * signersValidationErrors[Signers][i] = ['Error 1', 'Error 2'];
     *
     * formValidationService.setErrors(signersValidationErrors) - sets errors of a form group with index i
     */
    setErrors(errors: string | ValidationErrors): void {
        if (typeof errors === 'string') {
            this.setGeneralErrors([errors]);
        }
        else {
            this.setValidationErrors(errors, this.formGroup, this.errors);
        }
    }

    /**
     * Get errors of AbstractControl.
     *
     * If control is not passed it will return the general errors.
     */
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

    /**
     * Search for FormArray by name and returns its length.
     *
     * If control is not found it will throw an error.
     *
     * If control is found but it is not of type FormArray will return 0.
     */
    getLength(formControlName: string | number | (string | number)[]): number {
        let control = this.getControl(formControlName);
        if (control instanceof FormArray) {
            return control.length;
        }

        return 0;
    }

    /**
     * Search for AbstractControl by name and returns its value.
     *
     * If control is not found it will throw an error.
     *
     * If formControlName is not passed it will return the value of initial FormGroup.
     */
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

    setValidators(formControlName: string | number | (string | number)[], validator: ValidatorFn | ValidatorFn[] | null): void {
        let control = this.getControl(formControlName);

        control.setValidators(validator);

        control.markAsTouched();
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

    private setValidationErrors(errors: ValidationErrors, formControl: AbstractControl, errorsContainer: IValidationErrors): void {
        if (errors[ModelValidationErrorsKey] !== null &&
            errors[ModelValidationErrorsKey] !== undefined) {
            this.setValidationErrors(errors[ModelValidationErrorsKey] as IValidationErrors, formControl, errorsContainer);
        }
        else {
            for (let fieldName in errors) {
                let currentErrors = errors[fieldName];
                let fieldKeys = this.getFieldKeys(fieldName);
                let findControlMetadata = this.tryGetControl(fieldKeys, formControl);

                if (Array.isArray(currentErrors)) {
                    if (findControlMetadata.isControlFound &&
                        findControlMetadata.control !== undefined &&
                        findControlMetadata.control !== null) {
                        if (findControlMetadata.control.untouched) {
                            findControlMetadata.control.markAsTouched();
                        }

                        findControlMetadata.control.setErrors({ invalid: true });

                        this.fillErrorsContainer(errorsContainer, fieldKeys, currentErrors);
                    }
                    else {
                        this.setGeneralErrors(currentErrors);
                    }
                }
                else {
                    let currentErrorsContainer = new ValidationErrors();

                    this.fillErrorsContainer(errorsContainer, fieldKeys, currentErrorsContainer);

                    this.setValidationErrors(currentErrors, findControlMetadata.control!, currentErrorsContainer);
                }
            }
        }
    }

    private getFieldKeys(errorFieldName: string): string | number | (string | number)[] {
        return errorFieldName.indexOf('.') >= 0 || errorFieldName.indexOf('[') >= 0 ?
            errorFieldName.split('.')
                .map(fp => fp.split('['))
                .reduce((previousValue, currentValue) => previousValue.concat(currentValue), [])
                .map(fp => this.getFieldKey(fp.replace(']', ''))) :
            this.getFieldKey(errorFieldName);
    }

    private getFieldKey(fieldName: string): string | number {
        let fieldKey: string | number = fieldName;

        let fieldKeyNumber = parseInt(fieldKey);
        if (!isNaN(fieldKeyNumber)) {
            fieldKey = fieldKeyNumber;
        }

        return fieldKey;
    }

    private fillErrorsContainer(errorsContainer: IValidationErrors, fieldKeys: string | number | (string | number)[], errors: string[] | IValidationErrors): void {
        if (Array.isArray(fieldKeys)) {
            let currentErrorsContainer = errorsContainer;

            fieldKeys.forEach((fieldKey, i) => {
                if (i < fieldKeys.length - 1) {
                    let newErrorsContainer = currentErrorsContainer[fieldKey] as IValidationErrors;

                    if (newErrorsContainer === undefined ||
                        newErrorsContainer === null) {
                        newErrorsContainer = new ValidationErrors();
                    }

                    currentErrorsContainer[fieldKey] = newErrorsContainer;

                    currentErrorsContainer = newErrorsContainer;
                }
                else {
                    currentErrorsContainer[fieldKey] = errors;
                }
            });
        }
        else {
            errorsContainer[fieldKeys] = errors;
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