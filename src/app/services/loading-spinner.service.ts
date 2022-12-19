import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingSpinnerService {
    private loadingSpinnerInvocationsCount: number;

    private _shouldShowLoadingSpinner: Subject<boolean>;

    constructor() {
        this.loadingSpinnerInvocationsCount = 0;

        this._shouldShowLoadingSpinner = new Subject<boolean>();
    }

    get shouldShowLoadingSpinner(): Observable<boolean> {
        return this._shouldShowLoadingSpinner.asObservable();
    }

    showLoadingSpinner(): void {
        this.loadingSpinnerInvocationsCount += 1;

        this.emitLoadingSpinnerStatus();
    }

    hideLoadingSpinner(): void {
        this.loadingSpinnerInvocationsCount -= 1;

        if (this.loadingSpinnerInvocationsCount < 0) {
            this.loadingSpinnerInvocationsCount = 0;
        }

        this.emitLoadingSpinnerStatus();
    }

    forceLoadingSpinnerToHide(): void {
        this.loadingSpinnerInvocationsCount = 0;

        this.emitLoadingSpinnerStatus();
    }

    private emitLoadingSpinnerStatus(): void {
        this._shouldShowLoadingSpinner.next(this.loadingSpinnerInvocationsCount > 0);
    }
}