import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoggerService} from "../logger/logger.service";
import {Temperature} from "../../../../../Shared/temperature.model";
import {Light} from "../../../../../Shared/light.model";
import {WindowModel} from "../../../../../Shared/window.model";

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  constructor(private logger: LoggerService,
              private http: HttpClient) { }

  public getLightingDevices() {
    this.logger.log('using GET to fetch Lighting Devices')
    return this.http.get<any>('http://localhost:8888/overview/lights');
  }

  public getTemperatureDevices() {
    this.logger.log('using GET to fetch temperature Devices')
    return this.http.get<any>('http://localhost:8888/overview/temperatures');
  }

  public getWindowDevices() {
    this.logger.log('using GET to fetch Window Devices')
    return this.http.get<any>('http://localhost:8888/overview/windows');
  }

  public setTargetTemperature(element: Temperature) {
    this.logger.log('using PUT to set target Temperature')
    return this.http.put<any>('http://localhost:8888/overview/changeTargetTemperature', element);
  }

  toggleLight(element: Light) {
    this.logger.log('using PUT to toggle Light');
    return this.http.put<any>('http://localhost:8888/overview/togglelight', element);
  }

  toggleWindow(element: WindowModel) {
    this.logger.log('using PUT to toggle Window');
    return this.http.put<any>('http://localhost:8888/overview/toggleWindow', element);
  }

  deleteLightDevice(id: string) {
    this.logger.log('using DELETE to delete Light');
    return this.http.delete<any>('http://localhost:8888/configuration/removelight/' + id);
  }

  deleteWindowDevice(id: string) {
    this.logger.log('using DELETE to delete Window');
    return this.http.delete<any>('http://localhost:8888/configuration/removewindow/' + id)
  }

  deleteTemperatureDevice(id: string) {
    this.logger.log('using DELETE to delete Temperature device');
    return this.http.delete<any>('http://localhost:8888/configuration/removetemperature/' + id)
  }

  addNewLightingDevice(newDevice: Light) {
    this.logger.log('using POST to add a new Lighting device');
    return this.http.post<any>('http://localhost:8888/configuration/addlight', newDevice);
  }
  addNewWindowDevice(newDevice: WindowModel) {
    this.logger.log('using POST to add a new Window device');
    return this.http.post<any>('http://localhost:8888/configuration/addwindow', newDevice);
  }
  addNewTemperatureDevice(newDevice: Temperature) {
    this.logger.log('using POST to add a new Temperature device');
    return this.http.post<any>('http://localhost:8888/configuration/addtemperature', newDevice);
  }
}
