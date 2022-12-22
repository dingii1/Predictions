import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbPaginationModule, NgbAlertModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { MyPredictionsComponent } from './components/my-predictions/my-predictions.component';
import { MakePredictionComponent } from './components/make-prediction/make-prediction.component';
import { AllPredictionsComponent } from './components/all-predictions/all-predictions.component';
import { StandingsComponent } from './components/standings/standings.component';

@NgModule({
  declarations: [
        AppComponent,
        LoadingSpinnerComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        MyPredictionsComponent,
        MakePredictionComponent,
        AllPredictionsComponent,
        StandingsComponent,
  ],
  imports: [
    BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      NgbDropdownModule,
      NgbModule
  ],
    providers: [
        FormBuilder,
        ErrorHandler
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }