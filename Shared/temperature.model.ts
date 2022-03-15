export class Temperature {

    id: string;
    room: string;
    actualTemperature : number;
    targetTemperature: number;


    constructor(room: string, actualTemperature: number, targetTemperature: number, id: string) {
        this.room = room;
        this.actualTemperature = actualTemperature;
        this.targetTemperature = targetTemperature;
        this.id = id;
    }
}