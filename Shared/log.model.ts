export class Log {

    id: string;
    date: number;
    username: string;
    message : string;


    constructor(message: string, date: number, id: string,username: string) {
        this.date = date;
        this.message = message;
        this.id = id;
        this.username = username;
    }
}