import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LoggerService} from "../logger/logger.service";

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private logger: LoggerService,
              private http: HttpClient) { }

  public getHistoryLogs() {
    this.logger.log('using GET to fetch history logs');
    return this.http.get<any>('http://localhost:8888/userlogs/logs');
  }

}
