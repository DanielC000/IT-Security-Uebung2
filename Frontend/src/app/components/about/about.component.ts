import { Component, OnInit } from '@angular/core';
import packageJson from "./../../../../package.json";
import {ConfirmationDialogComponent} from "../dialog/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthenticationService} from "../../services/authentication/authentication.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  version: string = packageJson.version;
  name: string = packageJson.name;

  constructor(public dialog: MatDialog,
              public authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  onClickAbout() {
    let text = 'Version: ' + this.version + ' ' + 'Name: ' + this.name;
    this.dialog.open(ConfirmationDialogComponent,{
      data: text
    });
  }

  isAdminPresent(): boolean {
    let admin = this.authenticationService.getCurrentUser;

    if (admin == null){
      return true;
    }
    return false;
  }
}
