import { Light } from "./light.model";
import { Temperature } from "./temperature.model";
import { User } from "./user.model";
import { WindowModel } from "./window.model";

export class ConfigDevicesUsers {

    users : User[];
    lights : Light[];
    temperatures: Temperature[];
    windows: WindowModel[];

    constructor() {
    }



}