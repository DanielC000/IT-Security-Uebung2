export class WindowModel {

    name: string;
    id: string;
    room: string;
    isOpen: boolean;

    constructor(name: string, room: string, open: boolean, id: string) {
        this.name = name;
        this.room = room;
        this.isOpen = open;
        this.id = id;
    }
}