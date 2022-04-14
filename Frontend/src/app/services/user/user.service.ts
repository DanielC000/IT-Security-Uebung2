import { Injectable } from '@angular/core';
import {LoggerService} from "../logger/logger.service";
import {HttpClient} from "@angular/common/http";
import {WindowModel} from "../../../../../Shared/window.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private logger: LoggerService,
              private http: HttpClient) { }

  changeUsername(username: string) {
    this.logger.log('using PUT to change username');
    return this.http.put<any>('http://localhost:8888/configuration/changeUsername/' + username, "");
  }
}
