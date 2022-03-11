export class Admin {

    id: string;
    username: string;
    password: string;
    email: string;
    profileImg: string;

    constructor(username: string, password: string, email: string, profilePicture: string, id: string) {
        this.password = password;
        this.username = username;
        this.email = email;
        this.profileImg = profilePicture;
        this.id = id;
    }
}