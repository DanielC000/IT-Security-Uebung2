export class User {

    id: string;
    username: string;
    password: string;
    role: string[];
    jwtToken: string;

    constructor(username: string, password: string, id: string, role: string[]) {
        this.password = password;
        this.username = username;
        this.id = id;
        this.role = role;
    }
}