export class Log {

    id: string;
    date: Date;
    username: string;
    message : string;


    constructor(message: string, date: Date, id: string,username: string) {
        this.date = date;
        this.message = message;
        this.id = id;
        this.username = username;
    }
}