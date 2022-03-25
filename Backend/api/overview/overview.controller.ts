import {controller, httpDelete, httpGet, httpPost, httpPut, interfaces} from "inversify-express-utils";
import {inject, injectable} from "inversify";
import {DatabaseService} from "../../core/services/database.service";
import {LoggerService} from "../../core/services/logger.service";
import {Request, Response} from 'express';
import {Light} from "../../../Shared/light.model";
import { Temperature } from "../../../Shared/temperature.model";
import { WindowModel } from "../../../Shared/window.model";
import { Log } from "../../../Shared/log.model";
import { Session } from "../../JWT/session";

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

    @httpPut('/togglelight/:id')
    public toggleLight(request: Request, response: Response): void {
        this.loggerService.info('received toggle light request');
        this.databaseService.toggleLight(request.params.id)
            .then(() => {
                let session: Session = response.locals.session;
                this.databaseService.insertNewLog(new Log("Toggle light from: "+ request.params.id, Date.now(),"", session.username))
                response.status(200).send();
            })
            .catch(error => {
                response.status(500).send(error);
            })
    }

    @httpPut('/changeTargetTemperature/:id&:targetTemperature')
    public changeTargetTemperature(request: Request, response: Response): void {
        this.loggerService.info('received edit entry request');
        this.databaseService.changeTargetTemperature(request.params.id, request.params.targetTemperature)
            .then(() => {
                let session: Session = response.locals.session;
                this.databaseService.insertNewLog(new Log("Changed target temperature from: "+request.params.id+ " to " + request.params.targetTemperature, Date.now(),"", session.username))
                response.status(200).send();
            })
            .catch(error => {
                response.status(500).send(error);
            })
    }

    @httpPut('/togglewindow/:id')
    public toggleWindow(request: Request, response: Response): void {
        this.loggerService.info('received toggle window request');
        this.databaseService.toggleWindow(request.params.id)
            .then(() => {
                let session: Session = response.locals.session;
                this.databaseService.insertNewLog(new Log("Toggle window from: "+ request.params.id, Date.now(),"", session.username))
                response.status(200).send();
            })
            .catch(error => {
                response.status(500).send(error);
            })
    }
}