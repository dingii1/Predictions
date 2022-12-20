import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
        AppComponent,
        LoadingSpinnerComponent,
        LoginComponent,
        RegisterComponent,
  ],
  imports: [
    BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule
  ],
    providers: [
        FormBuilder,
        ErrorHandler
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }