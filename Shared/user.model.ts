export class User {

    id: string;
    username: string;
    password: string;
    admin: Boolean

    constructor(username: string, password: string, id: string, admin: Boolean) {
        this.password = password;
        this.username = username;
        this.id = id;
        this.admin = admin;
    }
}