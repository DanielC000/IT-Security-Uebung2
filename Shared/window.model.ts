export class WindowModel {

    id: string;
    name: string;
    room: string;
    isOpen: boolean;

    constructor(room: string, isOpen: boolean, id: string, name: string) {
        this.room = room;
        this.isOpen = isOpen;
        this.name = name;
        this.id = id;
    }
}