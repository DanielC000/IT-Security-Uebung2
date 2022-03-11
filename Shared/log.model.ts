export class Log {

    id: string;
    date: Date;
    message : string;


    constructor(message: string, date: Date, id: string) {
        this.date = date;
        this.message = message;
        this.id = id;
    }
}