export class User {
  public firstName: string;
  public lastName: string;
  public time: string;
  public date: string;
  public code: string;

  constructor(firstName: string, lastName: string, date: string, time: string, code: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.date = date;
    this.time = time;
    this.code = code;
  }

}
