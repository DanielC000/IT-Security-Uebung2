import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NativeObjectService} from "../../services/native-object.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoggerService} from "../../services/logger/logger.service";
import {Admin} from "../../models/admin.model";
import {AppRoutingModule} from "../../app-routing.module";

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
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (this.authenticationService.getCurrentUser != null) {
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
      .loginUser(new Admin(
        this.loginForm.value.username,
        this.loginForm.value.password,
        '', '', ''))
      .then(() => this.router.navigate([this.returnUrl]))
      .catch(error => this.loggerService.log(error));

    this.loggerService.log(this.loginForm.value);
  }
}
