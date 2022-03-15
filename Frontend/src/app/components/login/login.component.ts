import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NativeObjectService} from "../../services/native-object.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoggerService} from "../../services/logger/logger.service";
import {Admin} from "../../models/admin.model";
import {AppRoutingModule} from "../../app-routing.module";
import {TokenStorageService} from "../../services/token-storage/token-storage.service";
import {User} from "../../../../../Shared/user.model";
import {ConfirmationDialogComponent} from "../dialog/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  loginSubmitted = false;
  public hide: boolean = true;
  loginInvalid: boolean = false;
  returnUrl: string;


  constructor(private loginFormBuilder: FormBuilder,
              private nativeObjectService: NativeObjectService,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private loggerService: LoggerService,
              private tokenStorage: TokenStorageService,
              private dialog: MatDialog
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (this.tokenStorage.getUser() != null) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.loginFormBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    this.authenticationService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: (value: User) => {
          console.log(value);
          this.tokenStorage.saveUser(value);
          this.tokenStorage.saveToken(value.jwtToken);
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.loggerService.log(error);
          this.dialog.open(ConfirmationDialogComponent, {
            data: error.error.message,
          });
        },
      });
  }
}
