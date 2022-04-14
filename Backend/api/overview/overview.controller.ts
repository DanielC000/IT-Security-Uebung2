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

    @httpPut('/togglelight')
    public toggleLight(request: Request, response: Response): void {
        this.loggerService.info('received toggle light request');
        let session: Session = response.locals.session;
        
        this.databaseService.insertNewLog(new Log("Toggle light in room: "+ request.body.room + " | "+request.body.name , "","", session.username));

        this.databaseService.toggleLight(request.body.id)
            .then(() => {

                response.status(200).send();
            })
            .catch(error => {
                response.status(500).send(error);
            })
    }

    @httpPut('/changeTargetTemperature')
    public changeTargetTemperature(request: Request, response: Response): void {
        this.loggerService.info('received edit entry request');
        this.loggerService.info(request.body);

        
        this.databaseService.changeTargetTemperature(request.body.id, request.body.targetTemperature)
            .then(() => {
                let session: Session = response.locals.session;
                this.databaseService.insertNewLog(new Log("Changed target temperature from: "+request.body.name+ " to " + request.params.targetTemperature, "","", session.username))
                response.status(200).send();
            })
            .catch(error => {
                response.status(500).send(error);
            })
    }

    @httpPut('/togglewindow')
    public toggleWindow(request: Request, response: Response): void {
        this.loggerService.info('received toggle window request');
        this.databaseService.toggleWindow(request.body.id)
            .then(() => {
                let session: Session = response.locals.session;
                this.databaseService.insertNewLog(new Log("Toggle window from: "+ request.body.name, "","", session.username))
                response.status(200).send();
            })
            .catch(error => {
                response.status(500).send(error);
            })
    }
}