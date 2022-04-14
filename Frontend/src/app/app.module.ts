import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatSelectModule} from "@angular/material/select";
import {HttpClientModule} from "@angular/common/http";
import {MatTableModule} from "@angular/material/table";
import {NativeObjectService} from "./services/native-object.service";
import {QRCodeModule} from "angularx-qrcode";
import {MatSortModule} from "@angular/material/sort";
import {QuestionDialogComponent} from './components/dialog/question-dialog/question-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {AboutComponent} from './components/about/about.component';
import {ConfirmationDialogComponent} from './components/dialog/confirmation-dialog/confirmation-dialog.component';
import { OverviewComponent } from './components/overview/overview.component';
import {authInterceptorProviders} from "./helpers/interceptor/auth.interceptor";
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { AddComponentDialogComponent } from './components/dialog/add-component-dialog/add-component-dialog.component';
import { HistoryComponent } from './components/history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    LoginComponent,
    QuestionDialogComponent,
    AboutComponent,
    ConfirmationDialogComponent,
    OverviewComponent,
    ConfigurationComponent,
    AddComponentDialogComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    FlexLayoutModule,
    MatSelectModule,
    HttpClientModule,
    MatTableModule,
    QRCodeModule,
    MatSortModule,
    MatDialogModule
  ],
  providers: [
    authInterceptorProviders,
    NativeObjectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
