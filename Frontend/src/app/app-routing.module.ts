import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {AboutComponent} from "./components/about/about.component";
import {OverviewComponent} from "./components/overview/overview.component";
import {ConfigurationComponent} from "./components/configuration/configuration.component";
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  {path: 'history', component: HistoryComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'configuration', component: ConfigurationComponent},
  {path: 'about', component: AboutComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
