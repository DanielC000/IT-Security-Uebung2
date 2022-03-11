export class User {

    id: string;
    role: string;
    username: string;
    password: string;

    constructor(username: string, password: string, role: string, id: string) {
        this.password = password;
        this.username = username;
        this.role = role;
        this.id = id;
    }
}