import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Light} from "../../../../../Shared/light.model";
import {DevicesService} from "../../services/devices/devices.service";
import {Temperature} from "../../../../../Shared/temperature.model";
import {WindowModel} from "../../../../../Shared/window.model";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public lightingDevices = new MatTableDataSource(new Array<Light>());
  public temperatureDevices = new MatTableDataSource(new Array<Temperature>());
  public windowDevices = new MatTableDataSource(new Array<Window>());

  displayedLightingColumns: string[] = ['deviceName', 'room', 'on'];
  displayedTemperatureColumns: string[] = ['deviceName', 'room', 'actualTemperature', 'targetTemperature'];
  displayedWindowColumns: string[] = ['windowName', 'room', 'open'];

  constructor(private deviceService: DevicesService) { }

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
      next: ( (value: Array<Window>) => {
        console.log(value);
        this.windowDevices.data = value;
      }),
      error: (err) =>{
        console.log(err);
      }
    })
  }

  toggleLightActivationStatus(element: Light) {

  }

  setTemperature(element: Temperature) {
    this.deviceService.setTargetTemperature(element)
  }

  toggleWindowActivationStatus(element: Window) {

  }
}
