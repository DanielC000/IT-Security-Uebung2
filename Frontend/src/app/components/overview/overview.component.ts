import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Light} from "../../../../../Shared/light.model";
import {DevicesService} from "../../services/devices/devices.service";
import {Temperature} from "../../../../../Shared/temperature.model";
import {WindowModel} from "../../../../../Shared/window.model";
import {TokenStorageService} from "../../services/token-storage/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public lightingDevices = new MatTableDataSource(new Array<Light>());
  public temperatureDevices = new MatTableDataSource(new Array<Temperature>());
  public windowDevices = new MatTableDataSource(new Array<WindowModel>());

  displayedLightingColumns: string[] = ['deviceName', 'room', 'on'];
  displayedTemperatureColumns: string[] = ['deviceName', 'room', 'actualTemperature', 'targetTemperature'];
  displayedWindowColumns: string[] = ['windowName', 'room', 'open'];

  constructor(
    private deviceService: DevicesService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {

    if (this.tokenStorage.getUser() == null) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.getLightingDevices();
    this.getTemperatureDevices();
    this.getWindowDevices();
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

  toggleLightActivationStatus(element: Light) {
    this.deviceService.toggleLight(element).subscribe({
    next: value => {
      console.log(value);
      this.getLightingDevices();
    },
      error: err => {
        console.log(err);
      }
    })
  }


  setTemperature(element: Temperature, value: string) {
    if (!parseInt(value)){
      return;
    }
    element.targetTemperature = parseInt(value);
    this.deviceService.setTargetTemperature(element).subscribe({
      next: value => {
        console.log(value);
        this.getLightingDevices();
      },
      error: err => {
        console.log(err);
      }
    })
  }

  toggleWindowActivationStatus(element: WindowModel) {
    this.deviceService.toggleWindow(element).subscribe({
      next: value => {
        console.log(value);
        this.getWindowDevices();
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
