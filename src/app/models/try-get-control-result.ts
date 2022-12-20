import { AbstractControl } from '@angular/forms';

export class TryGetControlResult {
    control: AbstractControl | null;

    constructor(control: AbstractControl | null) {
        this.control = control;
    }

    get isControlFound(): boolean {
        return this.control !== null && this.control !== undefined;
    }
}