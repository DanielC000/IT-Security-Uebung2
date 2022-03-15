export class Light {

    id: string;
    name: string;
    room: string;
    on: boolean;

    constructor(room: string,name: string, on: boolean, id: string) {
        this.room = room;
        this.name = name;
        this.on = on;
        this.id = id;
    }
}

