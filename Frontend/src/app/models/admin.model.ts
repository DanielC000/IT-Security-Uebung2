export class Admin {
  public username: string;
  public password: string;
  public email: string;
  public id: string;
  public profileImg: string;

  constructor(username: string, password: string, email: string, profileImg: string, id: string) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.profileImg = profileImg;
    this.id = id;
  }

}
