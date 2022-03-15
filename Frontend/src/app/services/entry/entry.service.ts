import {HttpClient} from "@angular/common/http";
import {LoggerService} from "../logger/logger.service";
import {Injectable} from "@angular/core";
import {Entry} from "../../models/entry.model";

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  constructor(private http: HttpClient, private logger: LoggerService) {
  }

  public createContact(entry: Entry) {
    this.logger.log('using POST to create new entry in database')
    return this.http.post<any>('http://localhost:8888/admin/create', entry);
  }

  public getContacts() {
    this.logger.log('using GET to fetch entries')
    return this.http.get<any>('http://localhost:8888/admin/entries');
  }

  public deleteContact(id: string) {
    this.logger.log('using DELETE to delete a entry');
    return this.http.delete<any>('http://localhost:8888/admin/delete/' + id);
  }

  public editContact(entry: Entry) {
    this.logger.log('using PUT to edit a entry');
    return this.http.put<any>('http://localhost:8888/admin/editEntry/', entry);
  }
}
