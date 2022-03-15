import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {NativeObjectService} from "../../../services/native-object.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication/authentication.service";
import {LoggerService} from "../../../services/logger/logger.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Entry} from "../../../models/entry.model";
import {PasswordPackage} from "../../../models/password-package.model";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  changePasswordForm!: FormGroup;
  public hideCurrent: boolean = true;
  public hideConfirm: boolean = true;
  public hideNew: boolean = true;
  loginInvalid: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
              private changePasswordFormBuilder: FormBuilder,
              private nativeObjectService: NativeObjectService,
              private authenticationService: AuthenticationService,
              private loggerService: LoggerService,
              public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
  ) {
  }

  ngOnInit(): void {
    this.changePasswordForm = this.changePasswordFormBuilder.group({
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: [this.isPasswordMatching('newPassword', 'confirmPassword')]
    });
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    let passwordPackage = new PasswordPackage(this.data,
      this.changePasswordForm.value.currentPassword,
      this.changePasswordForm.value.newPassword, this.changePasswordForm.value.confirmPassword);

    this.dialogRef.close(passwordPackage);

  }

  onBack() {
    this.dialogRef.close();
  }

  private isPasswordMatching(newPassword: string, confirmPassword: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(newPassword);
      const checkControl = controls.get(confirmPassword);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(confirmPassword)?.setErrors({matching: true});
        return {matching: true};
      } else {
        return null;
      }
    };
  }
}
