import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoggerService} from "../logger/logger.service";

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  constructor(private logger: LoggerService,
              private http: HttpClient) { }

  public getDevices() {
    this.logger.log('using GET to fetch entries')
    return this.http.get<any>('http://localhost:8888/overview/lights');
  }
}
