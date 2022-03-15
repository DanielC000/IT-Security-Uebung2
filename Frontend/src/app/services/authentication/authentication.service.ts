import {Injectable} from '@angular/core';
import {Admin} from "../../models/admin.model";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {NativeObjectService} from "../native-object.service";
import {LoginService} from "../login/login.service";
import {getMatIconFailedToSanitizeLiteralError} from "@angular/material/icon";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUser: Admin | undefined;

  constructor(private nativeObjectService: NativeObjectService,
              private http: HttpClient,
              private loginService: LoginService) {
  }

  public get getCurrentUser(): string | null {
    return sessionStorage.getItem('currentUser');
  }

  public async loginUser(admin: Admin): Promise<boolean> {
    this.loginService.loginUser(admin)
      .subscribe({
        next: (admin: Admin) => {
          sessionStorage.setItem('currentUser', JSON.stringify(admin));
          return true;
        },
        error: () => {
          return false;
        }
      })
    return false;
  }

  public logout() {
    sessionStorage.removeItem('currentUser');
  }

  updateUser(admin: Admin) {
    sessionStorage.setItem('currentUser', JSON.stringify(admin));
  }
}
