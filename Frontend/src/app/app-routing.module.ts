import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {AdminAccountComponent} from "./components/admin-account/admin-account.component";
import {AboutComponent} from "./components/about/about.component";
import {OverviewComponent} from "./components/overview/overview.component";

const routes: Routes = [
  {path: 'overview', component: OverviewComponent},
  {path: 'about', component: AboutComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'account', component: AdminAccountComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
