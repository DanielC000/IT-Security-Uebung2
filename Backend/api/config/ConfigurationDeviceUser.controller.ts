import {controller, httpDelete, httpGet, httpPost, httpPut, interfaces} from "inversify-express-utils";
import {inject, injectable} from "inversify";
import {DatabaseService} from "../../core/services/database.service";
import {LoggerService} from "../../core/services/logger.service";
import {Request, Response} from 'express';
import {ConfigDevicesUsers} from "../../../Shared/ConfigDevicesUsers.model";
import { Temperature } from "../../../Shared/temperature.model";
import { WindowModel } from "../../../Shared/window.model";
import { Light } from "../../../Shared/light.model";
import { User } from "../../../Shared/user.model";




@controller('/configuration')
@injectable()
export class ConfigurationDeviceUserController implements interfaces.Controller {
    constructor(
        @inject(DatabaseService.name) private databaseService: DatabaseService,
        @inject(LoggerService.name) private loggerService: LoggerService,
    ) {
    }

    @httpGet('/configdata')
    public getAllLights(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');

        let config = new ConfigDevicesUsers();
        
        this.databaseService.getAllLights()
            .then((contacts: Array<Light>) => {
                config.lights = contacts;
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })

        this.databaseService.getAllWindows()
            .then((contacts: Array<WindowModel>) => {
                config.windows = contacts;
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })

        this.databaseService.getAllTemperatures()
            .then((contacts: Array<Temperature>) => {
                config.temperatures = contacts;
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })

        this.databaseService.getAllUsers()
            .then((contacts: Array<User>) => {
                config.users = contacts;
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })

        response.status(200).send(config);
    }
}