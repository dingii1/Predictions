import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPredictionsComponent } from './components/all-predictions/all-predictions.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MakePredictionComponent } from './components/make-prediction/make-prediction.component';
import { MyPredictionsComponent } from './components/my-predictions/my-predictions.component';
import { RegisterComponent } from './components/register/register.component';
import { StandingsComponent } from './components/standings/standings.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            {
                path: 'home',
                component: HomeComponent,
                children: [
                    { path: 'my-predictions', component: MyPredictionsComponent },
                    { path: 'make-prediction', component: MakePredictionComponent },
                    { path: 'all-predictions', component: AllPredictionsComponent },
                    { path: 'standings', component: StandingsComponent },
                    { path: '**', redirectTo: 'my-predictions' }
                ]
            },
            { path: '**', redirectTo: 'login' }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
