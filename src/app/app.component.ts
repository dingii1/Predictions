import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { LoadingSpinnerService } from './services/loading-spinner.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    shouldShowLoadingSpinner: boolean;

    private subscription: Subscription;

    constructor(private loadingSpinnerService: LoadingSpinnerService, private changeDetector: ChangeDetectorRef) {
        this.shouldShowLoadingSpinner = false;

        this.subscription = new Subscription();
    }

    async ngOnInit(): Promise<void> {
        this.subscribeForLoadingIndicatorStatus();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private subscribeForLoadingIndicatorStatus() {
        this.subscription.add(this.loadingSpinnerService.shouldShowLoadingSpinner.subscribe((shouldShowLoadingSpinner) => {
            if (this.shouldShowLoadingSpinner !== shouldShowLoadingSpinner) {
                this.shouldShowLoadingSpinner = shouldShowLoadingSpinner;

                this.changeDetector.detectChanges();
            }
        }));
    }
}