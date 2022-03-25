import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoggerService} from "../../services/logger/logger.service";
import {TokenStorageService} from "../../services/token-storage/token-storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import { User } from '../../../../../Shared/user.model';
import {MatTableDataSource} from "@angular/material/table";
import {Light} from "../../../../../Shared/light.model";
import {Temperature} from "../../../../../Shared/temperature.model";
import {WindowModel} from "../../../../../Shared/window.model";
import {DevicesService} from "../../services/devices/devices.service";
import {MatDialog} from "@angular/material/dialog";
import {AddComponentDialogComponent} from "../dialog/add-component-dialog/add-component-dialog.component";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  accountForm!: FormGroup;
  loading: boolean = false;
  user!: User;
  returnUrl: string;
  isAdmin: boolean = false;

  lightingDevices = new MatTableDataSource(new Array<Light>());
  temperatureDevices = new MatTableDataSource(new Array<Temperature>());
  windowDevices = new MatTableDataSource(new Array<WindowModel>());

  displayedLightingColumns: string[] = ['deviceName', 'room', 'delete'];
  displayedTemperatureColumns: string[] = ['deviceName', 'room', 'delete'];
  displayedWindowColumns: string[] = ['windowName', 'room', 'delete'];

  constructor(private loggerService: LoggerService,
              private deviceService: DevicesService,
              private accountFormBuilder: FormBuilder,
              private tokenStorage: TokenStorageService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (this.tokenStorage.getUser() == null) {
      this.router.navigate([this.returnUrl]);
    }

    this.user = this.tokenStorage.getUser();
    console.log(this.user);
    let roles = this.user.role;
    console.log(roles);

    for (let i = 0; i < this.user.role.length; i++){
      if (roles[i] == "Admin"){
        this.isAdmin = true;
      }
    }
    console.log(this.isAdmin)
  }

  ngOnInit(): void {

    this.getLightingDevices();
    this.getTemperatureDevices();
    this.getWindowDevices();

    this.accountForm = this.accountFormBuilder.group({
      username: [this.user.username, [Validators.minLength(6)]]
    })
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      return;
    }


  }

  private getLightingDevices() {
    this.deviceService.getLightingDevices().subscribe({
      next: ( (value: Array<Light>) => {
        console.log(value);
        this.lightingDevices.data = value;
      }),
      error: (err) =>{
        console.log(err);
      }
    })
  }

  private getTemperatureDevices(){
    this.deviceService.getTemperatureDevices().subscribe({
      next: ( (value: Array<Temperature>) => {
        console.log(value);
        this.temperatureDevices.data = value;
      }),
      error: (err) =>{
        console.log(err);
      }
    })
  }

  private getWindowDevices(){
    this.deviceService.getWindowDevices().subscribe({
      next: ( (value: Array<WindowModel>) => {
        console.log(value);
        this.windowDevices.data = value;
      }),
      error: (err) =>{
        console.log(err);
      }
    })
  }

  addNewLightingDevice() {
    const dialogRef = this.dialog.open(AddComponentDialogComponent, {
      data: 'light'
    });

    dialogRef.afterClosed().subscribe( (result) =>{
      if (result){
        console.log(result);
        let newDevice = new Light(result.room,result.name, false, "");
        this.deviceService.addNewLightingDevice(newDevice).subscribe({
          next: value => {
            console.log(value);
            this.getLightingDevices();
          },
          error: err => {
            console.log(err);
          }
        })
      }
      else {
        this.loggerService.log('Dialog cancelled by user');
      }
    });
  }

  addNewWindowDevice() {
    const dialogRef = this.dialog.open(AddComponentDialogComponent, {
      data: 'window'
    });

    dialogRef.afterClosed().subscribe( (result) =>{
      if (result){
        console.log(result);
        let newDevice = new WindowModel(result.room, false, "", result.name);
        this.deviceService.addNewWindowDevice(newDevice).subscribe({
          next: value => {
            console.log(value);
            this.getWindowDevices();
          },
          error: err => {
            console.log(err);
          }
        });
      }
      else {
        this.loggerService.log('Dialog cancelled by user');
      }
    });
  }
  addNewTemperature() {
    const dialogRef = this.dialog.open(AddComponentDialogComponent, {
      data: 'temperature'
    });

    dialogRef.afterClosed().subscribe( (result) =>{
      if (result){
        console.log(result);
        let newDevice = new Temperature(result.room,0, result.targetTemperature, "");
        this.deviceService.addNewTemperatureDevice(newDevice).subscribe({
          next: value => {
            console.log(value);
            this.getTemperatureDevices();
          },
          error: err => {
            console.log(err);
          }
        })
      }
      else {
        this.loggerService.log('Dialog cancelled by user');
      }
    });
  }
  deleteLightingDevice(element: Light) {
    this.deviceService.deleteLightDevice(element.id).subscribe({
      next: value => {
        console.log(value);
        this.getLightingDevices();
      },
      error: err => {
        console.log(err);
      }
    })
  }

  deleteWindowDevice(element: WindowModel) {
    this.deviceService.deleteWindowDevice(element.id).subscribe({
      next: value => {
        console.log(value);
        this.getWindowDevices();
      },
      error: err => {
        console.log(err);
      }
    })
  }

  deleteTemperatureDevice(element: Temperature) {
    this.deviceService.deleteTemperatureDevice(element.id).subscribe({
      next: value => {
        console.log(value);
        this.getTemperatureDevices();
      },
      error: err => {
        console.log(err);
      }
    })
  }

  changeMade() {
    return undefined;
  }

  onBack() {

  }

  onChangePassword() {

  }
}
