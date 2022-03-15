import {HttpClient} from "@angular/common/http";
import {LoggerService} from "../logger/logger.service";
import {Injectable} from "@angular/core";
import {PasswordPackage} from "../../models/password-package.model";
import {User} from "../../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class CheckingService {
  constructor(private http: HttpClient, private logger: LoggerService) {
  }

  public checkIn(userData: User) {
    this.logger.log('using PUT to edit an admin');
    return this.http.post<string>('http://localhost:8888/user/checkin', userData);
  }

  public checkOut(userData: User) {
    this.logger.log('using PUT to change an admin password');
    return this.http.put<any>('http://localhost:8888/user/checkout/', userData);
  }
}
