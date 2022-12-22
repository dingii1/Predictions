import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingSpinnerService } from '../../services/loading-spinner.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    isMenuCollapsed: boolean;

    // userProfileViewModel: UserProfileViewModel;

    private subscription: Subscription;

    constructor(private authenticationService: AuthenticationService, private routerService: Router, private loadingSpinnerService: LoadingSpinnerService) {
        this.isMenuCollapsed = true;

        this.subscription = new Subscription();
    }

    async ngOnInit(): Promise<void> {
        this.getUserProfile();
    }

    onToggleButtonClicked(): void {
        this.isMenuCollapsed = !this.isMenuCollapsed;
    }

    onNavigationButtonClicked(): void {
        this.isMenuCollapsed = true;
    }

    onLogoutButtonClicked(): void {
        // this.routerService.navigate(['/', AccountsRouterParam, VolunteersRouterParam, 'login'], { queryParams: { shouldLogout: true } });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private getUserProfile(): void {
        // this.subscription.add(this.authenticationService.loggedUser
        //     .subscribe((userProfileViewModel: UserProfileViewModel | null) => {
        //         this.userProfileViewModel = userProfileViewModel;
        //     }));
    }
}