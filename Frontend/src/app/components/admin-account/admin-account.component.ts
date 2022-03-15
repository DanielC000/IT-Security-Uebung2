import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoggerService} from "../../services/logger/logger.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {Admin} from "../../models/admin.model";
import {AccountService} from "../../services/account/account.service";
import {ChangePasswordDialogComponent} from "../dialog/change-password-dialog/change-password-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../dialog/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.scss']
})
export class AdminAccountComponent implements OnInit {

  accountForm!: FormGroup;
  loading: boolean = false;
  admin!: Admin;
  returnUrl: string;

  constructor(private loggerService: LoggerService,
              private accountFormBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router,
              private accountService: AccountService,
              private route: ActivatedRoute,
              public dialog: MatDialog
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (this.authenticationService.getCurrentUser == null) {
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit(): void {

    this.updateCurrentUser();

    this.accountForm = this.accountFormBuilder.group({
      username: [this.admin.username, [Validators.minLength(6)]],
      profileImg: [this.admin.profileImg,],
      email: [this.admin.email, [Validators.email]]
    });
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      return;
    }
    let admin = new Admin(this.accountForm.value.username,
      this.accountForm.value.password, this.accountForm.value.email, this.accountForm.value.profileImg, this.admin.id);
    this.accountService.editAdmin(admin)
      .subscribe({
        next: () => {
          this.loggerService.log('admin account edit successful')
          this.authenticationService.updateUser(admin);
          this.dialog.open(ConfirmationDialogComponent, {
            data: 'Account edited successfully.'
          });
          this.updateCurrentUser();
        },
        error: (err) => {
          this.loggerService.log('error while attempting to edit admin account');
          this.loggerService.log(err);
          this.dialog.open(ConfirmationDialogComponent, {
            data: 'Could not edit account.'
          });
        }
      })
  }

  onBack() {
    this.router.navigate([this.returnUrl]);
  }

  updateCurrentUser(){
    let admin = this.authenticationService.getCurrentUser;

    if (admin != null) {
      this.admin = JSON.parse(admin);
    } else {
      this.router.navigate(['/home']);
    }
  }

  changeMade() {
    if (this.accountForm.invalid) {
      return true;
    }

    return !(this.accountForm.value.username != this.admin.username ||
      this.accountForm.value.email != this.admin.email ||
      this.accountForm.value.profileImg != this.admin.profileImg);
  }

  onChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      data: this.admin.id,
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.accountService.changePassword(result)
            .subscribe({
              next: value => {
                this.dialog.open(ConfirmationDialogComponent, {
                  data: 'Password changed successfully!'
                });
                this.loggerService.log('changed password successfully');
              },
              error: err => {
                this.dialog.open(ConfirmationDialogComponent, {
                  data: 'Could not change password! Try again.'
                });
                this.loggerService.log('changing password unsuccessful');
              }
            })
        } else {
          this.loggerService.log('user cancelled editing process')
        }
      });
  }
}
