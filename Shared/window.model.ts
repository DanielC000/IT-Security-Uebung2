export class WindowModel {

    id: string;
    room: string;
    open: boolean;

    constructor(room: string, open: boolean, id: string) {
        this.room = room;
        this.open = open;
        this.id = id;
    }
}