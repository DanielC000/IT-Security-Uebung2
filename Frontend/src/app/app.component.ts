import {Component, ViewChild} from '@angular/core';
import {LoggerService} from "./services/logger/logger.service";
import {MatSidenav} from "@angular/material/sidenav";
import {BreakpointObserver} from "@angular/cdk/layout";
import {delay} from "rxjs";
import {NativeObjectService} from "./services/native-object.service";
import {AuthenticationService} from "./services/authentication/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(MatSidenav)
  sideNav!: MatSidenav;

  constructor
  (
    protected loggerService: LoggerService,
    private observer: BreakpointObserver,
    protected nativeObjectService: NativeObjectService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    this.loggerService.log('APP Component Init')
  }

  public ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sideNav.mode = 'over';
          this.sideNav.close();
        } else {
          this.sideNav.mode = 'side';
          this.sideNav.open();
        }
      })
  }


  handleLogoutButtonClick() {
    this.authenticationService.logout();
    // this.nativeObjectService.getNativeWindow().location.href= "/home";
    this.router.navigate(['/home']);
  }

  viewAdminProfile() {
    this.router.navigate(['/account']);
  }
}
