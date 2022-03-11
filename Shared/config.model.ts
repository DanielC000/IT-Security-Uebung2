import { Temperature } from "./temperature.model";
import { User } from "./user.model";

export class Light {

    users : User[];
    lights : Light[];
    temperatures: Temperature[];
    windows: Window[];

    constructor(users: User[], lights : Light[], temperatures: Temperature[], windows: Window[]) {
        this.users = users;
        this.lights = lights;
        this.temperatures = temperatures;
        this.windows = windows;
    }
}