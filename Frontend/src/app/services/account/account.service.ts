import {HttpClient} from "@angular/common/http";
import {LoggerService} from "../logger/logger.service";
import {Admin} from "../../models/admin.model";
import {Injectable} from "@angular/core";
import {PasswordPackage} from "../../models/password-package.model";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient, private logger: LoggerService) {
  }

  public editAdmin(admin: Admin) {
    this.logger.log('using PUT to edit an admin');
    return this.http.put<string>('http://localhost:8888/admin/editAdmin/', admin);
  }

  public changePassword(passwordPackage: PasswordPackage) {
    this.logger.log('using PUT to change an admin password');
    return this.http.put<any>('http://localhost:8888/admin/changePassword/', passwordPackage);
  }
}
