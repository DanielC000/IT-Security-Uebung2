import {controller, httpDelete, httpGet, httpPost, httpPut, interfaces} from "inversify-express-utils";
import {inject, injectable} from "inversify";
import {DatabaseService} from "../../core/services/database.service";
import {LoggerService} from "../../core/services/logger.service";
import {Request, Response} from 'express';
import {Light} from "../../../Shared/light.model";
import { Temperature } from "../../../Shared/temperature.model";
import { WindowModel } from "../../../Shared/window.model";




@controller('/overview')
@injectable()
export class OverviewController implements interfaces.Controller {
    constructor(
        @inject(DatabaseService.name) private databaseService: DatabaseService,
        @inject(LoggerService.name) private loggerService: LoggerService,
    ) {
    }

    // ------------------ Get ---------------------

    @httpGet('/lights')
    public getAllLights(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        this.databaseService.getAllLights()
            .then((contacts: Array<Light>) => {
                response.status(200).send(contacts);
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })
    }

    @httpGet('/temperatures')
    public getAllTemperatures(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        this.databaseService.getAllTemperatures()
            .then((contacts: Array<Temperature>) => {
                response.status(200).send(contacts);
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })
    }

    @httpGet('/windows')
    public getAllWindows(request: Request, response: Response): void {
        this.loggerService.info('Received get all entries request');
        this.databaseService.getAllWindows()
            .then((contacts: Array<WindowModel>) => {
                response.status(200).send(contacts);
            })
            .catch((error) => {
                response.status(500).send('error occurred while fetching data from database')
            })
    }


    // ----------------------- Edit, Put ---------------------

    @httpPut('/changelight')
    public changeLight(request: Request, response: Response): void {
        this.loggerService.info(request.body.user.username);
        this.loggerService.info('received edit entry request');
        this.databaseService.editLight(request.body.light)
            .then(() => {
                response.status(200).send();
            })
            .catch(error => {
                response.status(500).send(error);
            })
    }

    @httpPut('/changetemperature')
    public changeTemperature(request: Request, response: Response): void {
        this.loggerService.info(request.body.user.username);
        this.loggerService.info('received edit entry request');
        this.databaseService.editTemperature(request.body.temperature)
            .then(() => {
                response.status(200).send();
            })
            .catch(error => {
                response.status(500).send(error);
            })
    }

    @httpPut('/changewindow')
    public changeWindow(request: Request, response: Response): void {
        this.loggerService.info(request.body.user.username);
        this.loggerService.info('received edit entry request');
        this.databaseService.editWindow(request.body.window)
            .then(() => {
                response.status(200).send();
            })
            .catch(error => {
                response.status(500).send(error);
            })
    }
}