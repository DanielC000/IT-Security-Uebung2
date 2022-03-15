import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoggerService} from "../logger/logger.service";
import {Temperature} from "../../../../../Shared/temperature.model";

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
    this.logger.log('using PUT to fetch set target Temperature')
    return this.http.put<any>('http://localhost:8888/overview/temperatures', element);
  }
}
