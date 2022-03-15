import {HttpClient} from "@angular/common/http";
import {LoggerService} from "../logger/logger.service";
import {Admin} from "../../models/admin.model";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private logger: LoggerService) {
  }

  public loginUser(user: Admin) {
    return this.http.post<any>('http://localhost:8888/user/login/', user);
  }
}
