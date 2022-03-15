export class User {

    id: string;
    role: string;
    username: string;
    password: string;
    admin: Boolean

    constructor(username: string, password: string, role: string, id: string, admin: Boolean) {
        this.password = password;
        this.username = username;
        this.role = role;
        this.id = id;
        this.admin = admin;
    }
}