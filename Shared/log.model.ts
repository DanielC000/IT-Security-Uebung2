export class Log {

    id: string;
    date: string;
    username: string;
    message : string;


    constructor(message: string, date: string, id: string,username: string) {
        this.date = date;
        this.message = message;
        this.id = id;
        this.username = username;
    }
}