export class WindowModel {

    id: string;
    name: string;
    room: string;
    open: boolean;

    constructor(room: string, open: boolean, id: string, name: string) {
        this.room = room;
        this.open = open;
        this.name = name;
        this.id = id;
    }
}