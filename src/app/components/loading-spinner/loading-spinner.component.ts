import { Component, OnInit, Input } from '@angular/core';

const SpinnerBorderWidthRatio = 7.5;

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
    @Input('size') size!: number;

    halfSize!: number;
    borderSize!: number;

    constructor() { }

    ngOnInit() {
        this.borderSize = (this.size / SpinnerBorderWidthRatio);
        this.halfSize = this.size / 2;
    }
}