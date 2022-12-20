import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HttpErrorsService {
    constructor() {
    }

    handleErrorResponse(httpErrorResponse: HttpErrorResponse, errorMessageHandler: (error: string | { [property: string]: string[] }) => void, routerParam?: string | string[], id?: number): void {
        this.handleError(httpErrorResponse.status, httpErrorResponse.error, errorMessageHandler, routerParam, id);
    }

    handleError(httpStatusCode: number, error: string | { [property: string]: string[] }, errorMessageHandler: (error: string | { [property: string]: string[] }) => void, routerParam?: string | string[], id?: number): void {
        switch (httpStatusCode) {
            case 0:
            case 415:
                errorMessageHandler('Server is not available');
                break;

            default:
                errorMessageHandler(error);
                break;
        }
    }
}